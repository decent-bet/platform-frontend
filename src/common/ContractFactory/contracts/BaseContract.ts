import { cry, Transaction } from 'thor-devkit'
import { Contract } from 'web3'
import { interval, from, of } from 'rxjs'
import { flatMap, switchMap, tap } from 'rxjs/operators'
import { IKeyHandler } from 'src/common/types'

interface IListenEventsSettings {
    config: { filter?: any }
    interval: 5000
    top?: number
}

interface IGetPastEventsSettings {
    filter: any
    fromBlock: string
    toBlock: string
    options: { offset: number; limit: number }
    range?: any
    order: string
    topics?: string[]
}

abstract class BaseContract<T extends Contract> {
    protected _thorify: any // thorify
    protected _instance: T
    protected _eventSubscription: any
    protected _keyHandler: IKeyHandler

    public get instance(): T {
        return this._instance
    }

    public get eventSubscription() {
        return this._eventSubscription
    }

    /**
     * @param {thorify} thorify
     * @param {T} instance
     * @param {IKeyHandler} keyHandler
     */
    constructor(thorify, instance: T, keyHandler: IKeyHandler) {
        this._thorify = thorify
        this._instance = instance
        this._eventSubscription = null
        this._keyHandler = keyHandler
    }

    /**
     *
     * @param {string} eventName
     * @param {IListenEventsSettings} settings
     * @param {Function} unsubscribeCondition //receive the events array on each interation
     *
     * settings.config object example: config = {filter: {}, fromBlock: 'latest', toBlock: 'latest', options: {offset: 1, limit: 1}, range: {}, order:'DESC', topics: []}
     */
    public listenForEvent(
        eventName,
        settings: IListenEventsSettings = {
            config: {},
            interval: 5000,
            top: undefined
        },
        unsubscribeCondition
    ) {
        return new Promise((resolve, reject) => {
            try {
                let totalRequests = 0

                if (settings.config && settings.config.filter === {})
                    delete settings.config.filter

                const promiseEvent = this.instance.getPastEvents(
                    eventName,
                    settings.config || {}
                )

                const subscription$ = interval(settings.interval || 5000)
                    .pipe(
                        flatMap(() => from(promiseEvent)),
                        switchMap(i => of(i)),
                        tap(i => {
                            totalRequests++
                        })
                    )
                    .subscribe(events => {
                        if (
                            unsubscribeCondition(events) || // ask for the unsubscribeCondition function
                            (settings.top && totalRequests >= settings.top) // validate the top vs totalRequests if it's not null
                        ) {
                            subscription$.unsubscribe() // stop making requests
                            resolve(events)
                        }
                    })
            } catch (error) {
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
    public async getPastEvents(
        eventName,
        config: IGetPastEventsSettings = {
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

        return await this.instance.getPastEvents(eventName, config)
    }

    /**
     * Get all the events for the filters given and return and observable,
     * execute every 10000 ms
     *
     * @param {Object} eventPromise
     */
    public getEventSubscription(eventPromise, intervaleAmount = 10000) {
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
    public async getBalance(address) {
        return await this._thorify.eth.getEnergy(address)
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
    public async signAndSendRawTransaction(
        to: string,
        gasPriceCoef: number | null,
        gas: number | null,
        data: string
    ) {
        if (!gasPriceCoef) gasPriceCoef = 0
        if (!gas) gas = 1000000

        let txBody = {
            from: this._thorify.eth.defaultAccount,
            to,
            gas,
            data,
            gasPriceCoef
        }

        let { privateKey } = await this._keyHandler.getWalletValues()
        let signed = await this._thorify.eth.accounts.signTransaction(
            txBody,
            privateKey
        )
        return await this._thorify.eth.sendSignedTransaction(
            signed.rawTransaction
        )
    }

    public async getSignedRawTx(to, value, data, gas, dependsOn) {
        let blockRef = await this._thorify.eth.getBlockRef()
        let { privateKey } = await this._keyHandler.getWalletValues()
        let signedTx = await this._thorify.eth.accounts.signTransaction(
            {
                to,
                value,
                data,
                chainTag: await this._thorify.eth.getChainTag(),
                blockRef,
                expiration: 32,
                gasPriceCoef: 0,
                gas,
                dependsOn,
                nonce: 12345678
            },
            privateKey
        )

        signedTx.id =
            '0x' +
            cry
                .blake2b256(
                    signedTx.messageHash,
                    this._thorify.eth.defaultAccount
                )
                .toString('hex')

        return signedTx
    }

    /**
     * Takes the encoded function, signs it and sends it to
     * the VET network
     *
     * @param {Array} clauses
     */
    public async signAndSendRawTransactionWithClauses(clauses) {
        // const gas = Transaction.intrinsicGas(clauses)
        const blockRef = await this._thorify.eth.getBlockRef()

        const body = {
            chainTag: await this._thorify.eth.getChainTag(),
            blockRef,
            expiration: 32,
            clauses,
            gasPriceCoef: 0,
            gas: 200000,
            dependsOn: null,
            nonce: 12345678
        }

        try {
            const tx = new Transaction(body)
            let { privateKey } = await this._keyHandler.getWalletValues()
            privateKey = privateKey.substring(2)

            const privateKeyBuffer = Buffer.from(privateKey, 'hex')
            tx.signature = cry.secp256k1.sign(
                cry.blake2b256(tx.encode()),
                privateKeyBuffer
            )
            const raw = tx.encode()
            return this._thorify.eth.sendSignedTransaction(
                '0x' + raw.toString('hex')
            )
        } catch (error) {
            console.error('signAndSendRawTransaction error', error)
            return null
        }
    }
}

export default BaseContract
