import {cry, Transaction} from 'thor-devkit'
import {KeyHandler} from '..'

import { interval, from } from 'rxjs'
import { flatMap } from 'rxjs/operators'

const keyHandler = new KeyHandler()

export default class BaseContract {

    /**
     * @param {Web3} web3
     * @param {Object} instance
     */
    constructor(web3, instance) {
        this.web3 = web3
        this.instance = instance
        this.eventSubscription = null
    }

    /**
     * Returns the past events for the event name and filter given
     *
     * @param {string} eventName
     * @param {Object} options
     */
    async getPastEvents(eventName, options = {filter: {}, fromBlock: 'latest', toBlock: 'latest'}) {
        if (options.filter === {})
            delete options.filter
        console.log('getPastEvents', options)
        return this.instance.getPastEvents(eventName,
            {
                range: {},
                options,
                order: "DESC"
            }
        )
    }

    /**
     * Get all the events for the filters given and return and observable,
     * execute every 10000 ms
     *
     * @param eventPromise
     */
    async getEventSubscription(eventPromise) {
        return interval(10000)
            .pipe(flatMap(() => { return from(eventPromise) }))
    }

    /**
     * Returns the balance of the given address
     *
     * @param {string} address
     */
    async getBalance(address) {
        console.log('getBalance()', address)
        return await this.web3.eth.getBalance(address)
    }

    async sendTransaction() {

    }

    /**
     * Takes the encoded function, signs it and sends it to
     * the ethereum network
     *
     * @param {String} to
     * @param {Number} gasPrice
     * @param {Number} gas
     * @param {String} data
     */
    async signAndSendRawTransaction(to, gasPrice, gas, data) {
        if (!gasPrice || gasPrice < 0) {
            gasPrice = this.web3.eth.gasPrice
        }

        if (!gas || gas < 0) {
            gas = 2000000
        }

        let txBody = {
            from: this.web3.eth.defaultAccount,
            to,
            gas,
            data,
            gasPrice
        }

        console.log('signAndSendRawTransaction - txBody:', txBody)

        try {
            let privateKey = keyHandler.get()
            let signed = await this.web3.eth.accounts.signTransaction(txBody, privateKey)
            let promiseEvent = this.web3.eth.sendSignedTransaction(signed.rawTransaction)
            return promiseEvent

        } catch (error) {
            console.error('signAndSendRawTransaction', error.message)
            return null
        }

    }

    async getSignedRawTx(to, value, data, gas, dependsOn) {
        let blockRef = await this.web3.eth.getBlockRef()

        let signedTx = await this.web3.eth.accounts.signTransaction({
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
        }, keyHandler.get())

        signedTx.id = '0x' + cry.blake2b256(
            signedTx.messageHash,
            this.web3.eth.defaultAccount
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
        const blockRef = await this.web3.eth.getBlockRef()
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
            let privateKey = keyHandler.get()
            privateKey = privateKey.substring(2)

            const privateKeyBuffer = Buffer.from(privateKey, 'hex')
            tx.signature = cry.secp256k1.sign(cry.blake2b256(tx.encode()), privateKeyBuffer)
            const raw = tx.encode()
            return this.web3.eth.sendSignedTransaction('0x' + raw.toString('hex'))
        } catch (error) {
            console.error('signAndSendRawTransaction error', error.stack)
            return null
        }

    }

}
