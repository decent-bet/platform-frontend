import NonceHandler from '../NonceHandler'
import Contract from 'truffle-contract'
import EthAccounts from 'web3-eth-accounts'
import Helper from '../../Components/Helper'

// Used for VSCode Type Checking
/* eslint-disable no-unused-vars */
import Web3 from 'web3'
/* eslint-enable no-unused-vars */

const helper = new Helper()
const nonceHandler = new NonceHandler()
const ethAccounts = new EthAccounts(helper.getGethProvider())

export default class AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     * @param {JSON} jsonAbi
     */
    constructor(web3, jsonAbi) {
        this.web3 = web3
        this.contract = Contract(jsonAbi)
        this.contract.setProvider(this.web3.currentProvider)
        // Dirty hack for web3@1.0.0 support for localhost testrpc,
        // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
        if (typeof this.contract.currentProvider.sendAsync !== 'function') {
            this.contract.currentProvider.sendAsync = this.setupCurrentProvider(this.contract)
        }
    }

    setupCurrentProvider(contract) {
        return function() {
            return contract.currentProvider.send.apply(
                contract.currentProvider,
                arguments
            )
        }
    }

    /** 
     * Initializes an instance of the contract 
     * @return {Promise<any>}
    */
    async deployed() {
       this.instance = await this.contract.deployed()
       return this.instance
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
        const from = this.web3.eth.defaultAccount
        const count = await this.web3.eth.getTransactionCount(from, 'latest')
        const nonce = nonceHandler.get(count)

        //Sign transaction
        const { rawTransaction } = await ethAccounts.signTransaction(
            {
                from,
                to,
                gas,
                data,
                nonce,
                gasPrice
            },
            privateKey
        )

        // Start sending
        const promiEvent = this.web3.eth.sendSignedTransaction(rawTransaction)

        // Increase nonce once transaction has been completed
        promiEvent.once('receipt', () => nonceHandler.set(nonce))

        // Return the "PromiEvent"
        // (https://web3js.readthedocs.io/en/1.0/callbacks-promises-events.html)
        return promiEvent
    }
}
