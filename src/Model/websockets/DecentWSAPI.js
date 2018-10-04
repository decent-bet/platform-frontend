import io from 'socket.io-client'
import {getStageConfig} from '../../config'

const cryptoJs = require("crypto-js")
const ethUtil = require('ethereumjs-util')
const {
    PATH_GET_LAST_SPIN,
    PATH_POST_FINALIZE_CHANNEL,
    PATH_GET_FINALIZED_CHANNEL_INFO,
    PATH_POST_PROCESS_SPIN
} = require('./path')

class DecentWSAPI {

    constructor(keyHandler, helper) {
        this.keyHandler = keyHandler
        this.helper = helper
        this.subscriptions = {}
        this._initSocket()
    }

    get config() {
        let stage = this.keyHandler.getStage()
        return getStageConfig(stage)
    }

    _initSocket() {
        this.socket = io(this.config.wsApiUrl)
        this._initSocketListeners()
    }

    _initSocketEmitListener = (_path) => {
        this.socket.on(_path, (data) => {
            console.log(`Received event from: ${_path}. Data: ${JSON.stringify(data)}`)
            if (
                this.subscriptions[_path] &&
                this.subscriptions[_path].length > 0
            )
                this.subscriptions[_path].map(subscription => {
                    if (subscription)
                        subscription(data)
                })
        })
    }

    _initSocketListeners() {
        this.socket.on('connect', () => {
            console.log(`Connected to Websocket server @ ${this.config.wsApiUrl}`)
            this._initSocketEmitListener(PATH_GET_LAST_SPIN)
            this._initSocketEmitListener(PATH_GET_FINALIZED_CHANNEL_INFO)
            this._initSocketEmitListener(PATH_POST_PROCESS_SPIN)
            this._initSocketEmitListener(PATH_POST_FINALIZE_CHANNEL)
        })

        this.socket.on('disconnect', () => {
            console.log(`Disconnected from Websocket server @ ${this.config.wsApiUrl}`)
        })
    }

    _subscribe(_path, cb) {
        console.log('_subscribe', _path)
        if (!this.subscriptions[_path])
            this.subscriptions[_path] = []
        const index = this.subscriptions[_path].length
        cb.unsubscribe = () => this._unsubscribe(_path, index)
        this.subscriptions[_path].push(cb)
    }

    _unsubscribe(_path, index) {
        console.log('_unsubscribe', _path, index)
        if (!this.subscriptions[_path])
            return
        delete this.subscriptions[_path][index]
    }

    _getResponseSubscription(path, cb) {
        const callback = (data) => {
            console.log('_getResponseSubscription', path, data)
            cb(data)
            callback.unsubscribe()
        }
        return this._subscribe(path, callback)
    }

    getProcessSpinResponseSubscription(cb) {
        return this._getResponseSubscription(PATH_POST_PROCESS_SPIN, cb)
    }

    getLastSpinResponseSubscription(cb) {
        return this._getResponseSubscription(PATH_GET_LAST_SPIN, cb)
    }

    getFinalizeChannelResponseSubscription(cb) {
        return this._getResponseSubscription(PATH_POST_FINALIZE_CHANNEL, cb)
    }

    /** Off-chain finally verifiable slot spins */
    spin = async (id, spin, aesKey) => {
        /**
         * Spin:
         *
         *      reelHash - reelHash from the house for this turn - finalReelHash if nonce == 1
         *      reel - empty if user and nonce == 1
         *      reelSeedHash - reelSeedHash from the house for this turn - finalReelSeedHash if nonce == 1
         *      prevReelSeedHash - empty if user & nonce == 1
         *      userHash - finalUserHash if nonce == 1
         *      prevUserHash - hash to obtain userHash
         *      nonce - turn number - increments by 1 for every user turn
         *      userBalance - initialDeposit if nonce == 1
         *      houseBalance - initialDeposit if nonce == 1
         *      betSize - betSize for this turn, determined by user
         *      sign - signed spin object
         *
         *
         * aesKey - send encrypted spin to server to save state
         */
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Spin', id, spin, aesKey)
                let encryptedSpin = cryptoJs.AES.encrypt(JSON.stringify(spin), aesKey).toString()

                let path = PATH_POST_PROCESS_SPIN
                let timestamp = this.helper.getTimestampInMillis()
                let sign = await this._getSign(path, timestamp)

                this.socket.emit(path, {
                    headers: {
                        authorization: {
                            id,
                            sign,
                            timestamp
                        }
                    },
                    id,
                    spin,
                    encryptedSpin
                })
                this.getProcessSpinResponseSubscription(data => resolve(data))
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * Get the latest encrypted spin saved by the house
     **/
    getLastSpin = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let path = PATH_GET_LAST_SPIN

                let timestamp = this.helper.getTimestampInMillis()
                let sign = await this._getSign(path, timestamp)

                this.socket.emit(path, {
                    headers: {
                        authorization: {
                            id,
                            sign,
                            timestamp
                        }
                    },
                    id
                })
                this.getLastSpinResponseSubscription((data) => resolve(data))
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * Notify the house when the user would like to finalize a channel to ensure the user can't spin while the
     * close channel transaction is being sent to the network
     *  */
    finalizeChannel = async (id, spin, aesKey, cb) => {
        let encryptedSpin = cryptoJs.AES.encrypt(JSON.stringify(spin), aesKey).toString()

        let path = PATH_POST_FINALIZE_CHANNEL
        let timestamp = this.helper.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        this.socket.emit(path, {
            headers: {
                authorization: {
                    id,
                    sign,
                    timestamp
                }
            },
            id,
            spin,
            encryptedSpin
        })
        return this.getFinalizeChannelResponseSubscription(cb)
    }

    /** Solidity ecsign implementation */
    signString = async (text) => {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        return new Promise(async (resolve, reject) => {
            let msgHash = ethUtil.sha3(text)
            let {privateKey} = await this.keyHandler.get()
            privateKey = ethUtil.toBuffer(privateKey)
            let defaultAccount = this.keyHandler.getAddress()
            console.log('Signing', text, ethUtil.bufferToHex(msgHash), 'as', defaultAccount,
                ethUtil.isValidPrivate(privateKey))

            const {v, r, s} = ethUtil.ecsign(msgHash, privateKey)
            const sgn = ethUtil.toRpcSig(v, r, s)

            console.log('v: ' + v + ', r: ' + sgn.slice(0, 66) + ', s: 0x' + sgn.slice(66, 130))

            let m = ethUtil.toBuffer(msgHash)
            let pub = ethUtil.ecrecover(m, v, r, s)
            let adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')

            console.log('Generated sign address', adr, defaultAccount)

            console.log('Generated msgHash', msgHash, 'Sign', sgn)
            let address = this.keyHandler.getAddress()
            if (address && adr !== address.toLowerCase())
                reject(new Error("Invalid address for signed message"))

            resolve({msgHash: msgHash, sig: sgn})
        })
    }

    _getSign = async (path, timestamp) => {
        let input = path + timestamp
        let sign = await this.signString(input)
        console.log('_getSign', input, sign)

        return sign.sig
    }

}

export default DecentWSAPI
