import NonceHandler from '../NonceHandler'
import EthAccounts from 'web3-eth-accounts'
import Helper from '../../Components/Helper'

const helper = new Helper()
const nonceHandler = new NonceHandler()
const ethAccounts = new EthAccounts(helper.getGethProvider())
const thorify = require('thorify').thorify

export default class ThorifyContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     * @param {JSON} jsonAbi
     */
    constructor(web3, jsonAbi) {
        this.json = jsonAbi
        this.web3 = thorify(web3)
        this.contract = new this.web3.eth.Contract(this.json.abi)
        let network = this.getJsonNetwork(this.json)
        this.contract.options.address = network.address
    }

    setupCurrentProvider(contract) {
        return function() {
            return contract.currentProvider.send.apply(
                contract.currentProvider,
                arguments
            )
        }
    }

    getJsonNetwork(json) {
        return json.networks[[Object.keys(json.networks)[0]]]
    }

    // async getEvents(eventName, options) {
    //     return await this.contract.getPastEvents(eventName, options)
    // }
    getBalance(address) {
        if (typeof this.web3.eth.getBalance === 'function') {
            // thorify
            return this.web3.eth.getBalance(address)
        }
        return this.contract.methods
            .balanceOf(address)
            .call({ from: this.web3.eth.defaultAccount })
    }
    /**
     * Takes the enconded function, signs it and sends it to
     * the ethereum network
     * @param {String} privateKey
     * @param {String} to
     * @param {Number} gasPrice
     * @param {Number} gas
     * @param {String} data
     */
    signAndSendRawTransaction = async (
        privateKey,
        to,
        gasPrice = 10000000000,
        gas,
        data
    ) => {
        // Get the nonce
        const count = await this.web3.eth.getTransactionCount(
            this.web3.eth.defaultAccount,
            'latest'
        )
        const nonce = nonceHandler.get(count)
        const chainId = await this.web3.eth.net.getId()

        if (!gasPrice) gasPrice = 10000000
        //Sign transaction
        // const { rawTransaction } = await ethAccounts.signTransaction(
        //     {
        //         chainId,
        //         nonce,
        //         to,
        //         data,
        //         gas,
        //         gasPrice
        //     },
        //     privateKey
        // )

        // // Start sending
        // const promiEvent = this.web3.eth.sendSignedTransaction(rawTransaction)

        this.web3.eth.accounts.wallet.add(privateKey)
        const promiEvent = this.web3.eth.sendTransaction({
            chainId,
            nonce,
            to,
            data,
            gas,
            gasPrice
        })

        // Increase nonce once transaction has been completed
        promiEvent.once('receipt', () => nonceHandler.set(nonce))

        // Return the "PromiEvent"
        // (https://web3js.readthedocs.io/en/1.0/callbacks-promises-events.html)
        return promiEvent
    }
}
