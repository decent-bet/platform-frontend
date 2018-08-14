
import { interval } from 'rxjs'
import { switchMap, finalize } from 'rxjs/operators';

export default class BaseContract {
    
    /**
     * @param {Web3} web3
     * @param {Object} instance
     * @param {KeyHandler} keyHandler
     */
    constructor(web3, instance, keyHandler) {
        this._web3 = web3
        this.instance = instance
        this._eventSubscription = null
        this._keyHandler = keyHandler
    }

    /**
     * Returns the past events for the event name and filter given 
     * 
     * @param {string} eventName 
     * @param {Object} options 
     */
    async getPastEvents(eventName, options = {filter: {}, fromBlock: 'latest', toBlock: 'latest'}) {
         return await this.instance.getPastEvents(eventName, options)
    }

    /**
     * Get all the events for the filters given and return and observable,
     * execute every 10000 ms
     * 
     * @param {Object} filter 
     * @param {string|Number} fromBlock 
     * @param {string|Number} toBlock 
     */
    getEvents(filter = {}, fromBlock = 0, toBlock = 'latest') {

        const intervalSource$ = interval(10000)
                                .pipe(finalize(() => console.log('UNSUBSCRIBED from allEvents'))) 
        
        this._eventSubscription = intervalSource$.pipe(
            switchMap(() => 
                this.instance.getPastEvents('allEvents', {
                    filter: filter,
                    fromBlock : fromBlock,
                    toBlock: toBlock
                }))
        )

        return this.eventSubscription
                              
    }

    /**
     * Returns the balance of the given address
     * 
     * @param {string} address 
     */
    async getBalance(address) {
        return await this.web3.eth.getBalance(address)
    }
    
    /**
     * Takes the enconded function, signs it and sends it to
     * the ethereum network
     * 
     * @param {String} to
     * @param {Number} gasPrice
     * @param {Number} gas
     * @param {String} data
     */
    async signAndSendRawTransaction (
        to, gasPrice, gas, data
    ) {
        if(!gasPrice || gasPrice < 0) {
            gasPrice = this.web3.eth.gasPrice
        }

        if(!gas || gas < 0) {
            gas = 50000
        }

        let txBody = {
            from: this.web3.eth.defaultAccount,
            to,
            gas,
            data,
            gasPrice
        }

        try {
            
            let privateKey = this._keyHandler.get()
            let signed = await this.web3.eth.accounts.signTransaction(txBody, privateKey)
            let promiseEvent = this.web3.eth.sendSignedTransaction(signed.raw)
            return promiseEvent

        } catch (error) {
            console.error('signAndSendRawTransaction', error.message)
            return null
        }
    
    }

}
