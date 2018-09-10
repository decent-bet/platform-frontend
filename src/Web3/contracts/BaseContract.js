import {cry, Transaction} from 'thor-devkit'

import { interval, from, of } from 'rxjs'
import { flatMap, switchMap } from 'rxjs/operators'

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
    // getPastEventsWs$(eventName, options) {
    //     const WS_URL = `wss://thor.test.decent.bet/subscriptions/event?addr=${options.address}&pos=${options.fromBlock}`

    //     console.log('getPastEvents', eventName, options)

    //     const { WebSocketSubject } = webSocket;
    //     const socket$ = new WebSocketSubject(WS_URL);

    //     // socket$.pipe(
    //     //     filter(i => i.type === 'utf-8')
    //     // )
    //     return socket$
    // }

    /**
     * Returns the past events for the event name and filter given
     *
     * @param {string} eventName
     * @param {Object} options
     */
    async getPastEvents(eventName, config = {filter: {}, fromBlock: 'latest', toBlock: 'latest', options: {offset: 1, limit: 1}, range: {}, order:'DESC', topics: []}) {
       
        if (config.filter === {})
            delete config.filter

        console.log('getPastEvents', eventName, config)

        return await this.instance.getPastEvents(eventName, config)
    }

    /**
     * Get all the events for the filters given and return and observable,
     * execute every 10000 ms
     *
     * @param {Object} eventPromise
     */
    getEventSubscription(eventPromise) {
        return interval(10000)
            .pipe(
                flatMap(() => { return from(eventPromise) }),
                switchMap(i => of(i)),
            )
    }

    /**
     * Returns the balance of the given address
     *
     * @param {string} address
     */
    async getBalance(address) {
        console.log('getBalance()', address)
        return await this._web3.eth.getEnergy(address)
    }

    /**
     * Takes the encoded function, signs it and sends it to
     * the ethereum network
     *
     * @param {String} to
     * @param {Number} gasPriceCoef
     * @param {Number} gas
     * @param {String} data
     */
    async signAndSendRawTransaction(to, gasPriceCoef, gas, data) {
        if (!gasPriceCoef)
            gasPriceCoef = 128

        //check the gas
        if (!gas || gas < 0) {
            gas = 5000000
        }

        let txBody = {
            from: this._web3.eth.defaultAccount,
            to,
            gas,
            data,
            gasPriceCoef
        }

        console.log('signAndSendRawTransaction - txBody:', txBody)

        let { privateKey } = this._keyHandler.get()
        let signed = await this._web3.eth.accounts.signTransaction(txBody, privateKey)
        return await this._web3.eth.sendSignedTransaction(signed.rawTransaction)

    }

    async getSignedRawTx(to, value, data, gas, dependsOn) {
        let blockRef = await this._web3.eth.getBlockRef()
        let { privateKey } = this._keyHandler.get()
        let signedTx = await this._web3.eth.accounts.signTransaction({
            to,
            value,
            data,
            chainTag: '0x27',
            blockRef,
            expiration: 32,
            gasPriceCoef: 128,
            gas,
            dependsOn,
            nonce: 12345678
        }, privateKey)

        signedTx.id = '0x' + cry.blake2b256(
            signedTx.messageHash,
            this._web3.eth.defaultAccount
        ).toString('hex')

        return signedTx
    }

    /**
     * Takes the encoded function, signs it and sends it to
     * the VET network
     *
     * @param {Array} clauses
     */
    async signAndSendRawTransactionWithClauses(clauses) {
        const gas = Transaction.intrinsicGas(clauses)
        const blockRef = await this._web3.eth.getBlockRef()
        console.log('signAndSendRawTransactionWithClauses', gas, blockRef)

        const body = {
            chainTag: '0xc7',
            blockRef,
            expiration: 32,
            clauses: clauses,
            gasPriceCoef: 128,
            gas: 200000,
            dependsOn: null,
            nonce: 12345678
        }

        try {
            const tx = new Transaction(body)
            let { privateKey } = this._keyHandler.get()
            privateKey = privateKey.substring(2)

            const privateKeyBuffer = Buffer.from(privateKey, 'hex')
            tx.signature = cry.secp256k1.sign(cry.blake2b256(tx.encode()), privateKeyBuffer)
            const raw = tx.encode()
            return this._web3.eth.sendSignedTransaction('0x' + raw.toString('hex'))
        } catch (error) {
            console.error('signAndSendRawTransaction error', error.stack)
            return null
        }

    }

}
