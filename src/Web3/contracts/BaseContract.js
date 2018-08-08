
export default class BaseContract {
    
    /**
     * @param {Web3} web3
     * @param {Object} instance
     */
    constructor(web3, instance) {
        this.web3 = web3
        this.instance = instance
    }

    async getPastEvents(eventName, options) {
         return await this.instance.getPastEvents(eventName, options)
    }


    async getBalance(address) {
        return await this.web3.eth.getBalance(address)
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
    async signAndSendRawTransaction (
        privateKey,
        to,
        gas,
        gasPriceCoef = 128,
        data
    ) {
        const chainTag = await this.web3.eth.getChainTag()

        if(!gasPriceCoef) {
            gasPriceCoef = 128
        }

        if(!gas || gas < 0) {
            gas = 50000
        }

        let txBody = {
            from: this.web3.eth.defaultAccount,
            to,
            gas,
            data,
            chainTag,
            expiration: 32,
            gasPriceCoef
        }
        
        return this.web3.eth.sendTransaction(txBody)
    }

}
