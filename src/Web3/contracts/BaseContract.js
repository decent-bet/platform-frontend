import NonceHandler from '../NonceHandler'

const nonceHandler = new NonceHandler()

export default class ThorifyContract {
    
    /**
     * @param {Web3} web3
     * @param {Object} instance
     */
    constructor(web3, instance) {
        this.web3 = web3
        this.instance = instance
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
