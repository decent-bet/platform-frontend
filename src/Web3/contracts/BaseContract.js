import { cry, Transaction } from 'thor-devkit'

import { interval, from, of } from 'rxjs'
import { flatMap, switchMap, tap } from 'rxjs/operators'

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
     *
     * @param {string} eventName
     * @param {Object} settings
     * @param {Function} unsubscribeCondition //receive the events array on each interation
     *
     * settings.config object example: config = {filter: {}, fromBlock: 'latest', toBlock: 'latest', options: {offset: 1, limit: 1}, range: {}, order:'DESC', topics: []}
     */
    listenForEvent(
        eventName,
        settings = { config: {}, interval: 5000, top: null },
        unsubscribeCondition
    ) {
        return new Promise((resolve, reject) => {
            try {
                let totalRequests = 0

                if (settings.config && settings.config.filter === {}) delete settings.config.filter

                const promiseEvent = this.instance.getPastEvents(
                    eventName,
                    settings.config || {}
                )

                const subscription$ = interval(settings.interval || 5000).pipe(
                    flatMap(() => from(promiseEvent)),
                    switchMap(i => of(i)),
                    tap( () => {
                        totalRequests++
                    })
                ).subscribe(events => {
                    console.log(`----------listenForEvent: ${eventName} - requests: ${totalRequests}`, events)
                    if (
                        unsubscribeCondition(events) || //ask for the unsubscribeCondition function
                        (settings.top && settings.top != null && totalRequests >= settings.top) //validate the top vs totalRequests if it's not null
                    ) {
                        subscription$.unsubscribe() //stop making requests
                        resolve(events)
                    }
                })
            } catch (error) {
                console.log(`Errro on listenForEvent: ${eventName}`, error)
                return reject(error)
            }
        })
    }

    /**
     * Returns the past events for the event name and filter given
     *
     * @param {string} eventName
     * @param {Object} options
     */
    async getPastEvents(
        eventName,
        config = {
            filter: {},
            fromBlock: 'latest',
            toBlock: 'latest',
            options: { offset: 1, limit: 1 },
            range: {},
            order: 'DESC',
            topics: []
        }
    ) {
        if (config.filter === {}) delete config.filter

        console.log('getPastEvents', eventName, config)

        return await this.instance.getPastEvents(eventName, config)
    }

    /**
     * Get all the events for the filters given and return and observable,
     * execute every 10000 ms
     *
     * @param {Object} eventPromise
     */
    getEventSubscription(eventPromise, intervaleAmount = 10000) {
        return interval(intervaleAmount).pipe(
            flatMap(() => {
                return from(eventPromise)
            }),
            switchMap(i => of(i))
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
        if (!gasPriceCoef) gasPriceCoef = 0

        let txBody = {
            from: this._keyHandler.getAddress(),
            to,
            gas,
            data,
            gasPriceCoef
        }

        console.log('signAndSendRawTransaction - txBody:', txBody)

        let { privateKey } = await this._keyHandler.get()
        let signed = await this._web3.eth.accounts.signTransaction(txBody, privateKey)
        return await this._web3.eth.sendSignedTransaction(signed.rawTransaction)
    }

    async getSignedRawTx(to, value, data, gas, dependsOn) {
        let blockRef = await this._web3.eth.getBlockRef()
        let { privateKey } = await this._keyHandler.get()
        let signedTx = await this._web3.eth.accounts.signTransaction({
            to,
            value,
            data,
            chainTag: '0x27',
            blockRef,
            expiration: 32,
            gasPriceCoef: 0,
            gas,
            dependsOn,
            nonce: 12345678
        }, privateKey)

        signedTx.id = '0x' + cry.blake2b256(
            signedTx.messageHash,
            this._keyHandler.getAddress()
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
            gasPriceCoef: 0,
            gas: 200000,
            dependsOn: null,
            nonce: 12345678
        }

        try {
            const tx = new Transaction(body)
            let { privateKey } = await this._keyHandler.get()
            privateKey = privateKey.substring(2)

            const privateKeyBuffer = Buffer.from(privateKey, 'hex')
            tx.signature = cry.secp256k1.sign(
                cry.blake2b256(tx.encode()),
                privateKeyBuffer
            )
            const raw = tx.encode()
            return this._web3.eth.sendSignedTransaction(
                '0x' + raw.toString('hex')
            )
        } catch (error) {
            console.error('signAndSendRawTransaction error', error.stack)
            return null
        }
    }
}
