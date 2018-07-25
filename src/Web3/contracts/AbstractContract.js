import NonceHandler from '../NonceHandler'
import EthAccounts from 'web3-eth-accounts'
import Helper from '../../Components/Helper'

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
        this.json = jsonAbi
        this.web3 = web3
        this.contract = new this.web3.eth.Contract(this.json.abi)
        let network = this.getJsonNetwork(this.json)
        this.contract.options.address = network.address
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
    
    getJsonNetwork(json) {
        return json.networks[[Object.keys(json.networks)[0]]] 
    }

    async deployed() {

        let networkId = await this.web3.eth.net.getId()        
        let network = this.json.networks[networkId]
        let jsonNetwork = this.getJsonNetwork(this.json)
        if(network && jsonNetwork.address === network.address) {
            return Promise.resolve(this.contract)
        }
        
        return Promise.reject(null)
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
        const count = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount, 'latest')
        const nonce = nonceHandler.get(count)
        const chainId = await this.web3.eth.net.getId()
        
        console.log('data', data)
        //Sign transaction
        const { rawTransaction } = await ethAccounts.signTransaction(
            {
                chainId,
                nonce,
                to,
                data,
                gas,
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
