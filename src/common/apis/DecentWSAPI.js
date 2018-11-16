import Utils from '../../common/helpers/Utils'
import io from 'socket.io-client'
import { WS_API_URL } from '../../config'

const ethUtil = require('ethereumjs-util')
const {
    PATH_POST_INIT_CHANNEL,
    PATH_GET_LAST_SPIN,
    PATH_POST_FINALIZE_CHANNEL,
    PATH_GET_FINALIZED_CHANNEL_INFO,
    PATH_POST_PROCESS_SPIN,
    paths
} = require('./wspaths')

class DecentWSAPI {
    constructor(keyHandler, utils) {
        this.keyHandler = keyHandler
        this.utils = utils
        this.subscriptions = {}
        this._initSocket()
    }

    _initSocket() {
        this.socket = io(WS_API_URL)
        this._initSocketListeners()
    }

    _initSocketEmitListener = _path => {
        this.socket.on(_path, ({ req, res }) => {
            console.log(
                `Received event from: ${_path}. Request: ${JSON.stringify(
                    req
                )}, Response: ${JSON.stringify(res)}`
            )
            if (
                this.subscriptions[_path] &&
                this.subscriptions[_path].length > 0
            )
                this.subscriptions[_path].map(subscription => {
                    if (subscription) subscription({ req, res })
                })
        })
    }

    _initSocketListeners() {
        this.socket.on('connect', () => {
            console.log(`Connected to Websocket server @ ${WS_API_URL}`)
            this._initSocketEmitListener(PATH_POST_INIT_CHANNEL)
            this._initSocketEmitListener(PATH_GET_LAST_SPIN)
            this._initSocketEmitListener(PATH_GET_FINALIZED_CHANNEL_INFO)
            this._initSocketEmitListener(PATH_POST_PROCESS_SPIN)
            this._initSocketEmitListener(PATH_POST_FINALIZE_CHANNEL)
        })

        this.socket.on('disconnect', () => {
            console.log(`Disconnected from Websocket server @ ${WS_API_URL}`)
        })
    }

    _subscribe(_path, cb) {
        if (!this.subscriptions[_path]) this.subscriptions[_path] = []
        const index = this.subscriptions[_path].length
        cb.unsubscribe = () => this._unsubscribe(_path, index)
        this.subscriptions[_path].push(cb)
    }

    _unsubscribe(_path, index) {
        if (!this.subscriptions[_path]) return
        delete this.subscriptions[_path][index]
    }

    _getResponseSubscription(path, _req, cb, keepAlive) {
        const callback = ({ req, res }) => {
            console.log(
                '_getResponseSubscription',
                path,
                _req,
                req,
                JSON.stringify(req) === JSON.stringify(_req),
                res
            )
            if (_req) {
                if (JSON.stringify(req) === JSON.stringify(_req)) {
                    cb({ req, res })
                    if (!keepAlive) callback.unsubscribe()
                }
            } else {
                cb({ req, res })
                if (!keepAlive) callback.unsubscribe()
            }
        }
        return this._subscribe(path, callback)
    }

    clearSubscriptions() {
        paths.map(path => {
            if (this.subscriptions[path])
                for (let i = 0; i < this.subscriptions[path].length; i++)
                    this._unsubscribe(path, i)
        })
    }

    getInitChannelResponseSubscription(req, cb, keepAlive) {
        return this._getResponseSubscription(
            PATH_POST_INIT_CHANNEL,
            req,
            cb,
            keepAlive
        )
    }

    getProcessSpinResponseSubscription(req, cb, keepAlive) {
        return this._getResponseSubscription(
            PATH_POST_PROCESS_SPIN,
            req,
            cb,
            keepAlive
        )
    }

    getLastSpinResponseSubscription(req, cb, keepAlive) {
        return this._getResponseSubscription(
            PATH_GET_LAST_SPIN,
            req,
            cb,
            keepAlive
        )
    }

    getFinalizeChannelResponseSubscription(req, cb, keepAlive) {
        return this._getResponseSubscription(
            PATH_POST_FINALIZE_CHANNEL,
            req,
            cb,
            keepAlive
        )
    }

    initChannel = (
        initialDeposit,
        channelNonce,
        initialUserNumber,
        finalUserHash,
        userTxs,
        blockRef,
        blockNumber
    ) => {
        return new Promise(async (resolve, reject) => {
            try {
                let path = PATH_POST_INIT_CHANNEL

                let address = await this.keyHandler.getPublicAddress()
                let timestamp = this.utils.getTimestampInMillis()
                let sign = await this._getSign(path, timestamp)
                let req = {
                    headers: {
                        authorization: {
                            address,
                            sign,
                            timestamp
                        }
                    },
                    initialDeposit,
                    channelNonce,
                    initialUserNumber,
                    finalUserHash,
                    userTxs,
                    blockRef,
                    blockNumber
                }
                console.log('initChannel', req)
                this.socket.emit(path, req)
                this.getInitChannelResponseSubscription(req, ({ req, res }) =>
                    resolve({
                        req,
                        res,
                        channelNonce
                    })
                )
            } catch (e) {
                reject(e)
            }
        })
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
                let encryptedSpin = await Utils.encryptAES(
                    JSON.stringify(spin),
                    aesKey
                ).toString()

                let address = await this.keyHandler.getPublicAddress()
                let path = PATH_POST_PROCESS_SPIN
                let timestamp = this.utils.getTimestampInMillis()
                let sign = await this._getSign(path, timestamp)
                let req = {
                    headers: {
                        authorization: {
                            address,
                            sign,
                            timestamp
                        }
                    },
                    id,
                    spin,
                    encryptedSpin
                }

                this.socket.emit(path, req)
                this.getProcessSpinResponseSubscription(req, ({ req, res }) =>
                    resolve({
                        req,
                        res,
                        spin
                    })
                )
            } catch (e) {
                console.error(e)
                reject(e)
            }
        })
    }

    /**
     * Get the latest encrypted spin saved by the house
     **/
    getLastSpin = id => {
        return new Promise(async (resolve, reject) => {
            try {
                let path = PATH_GET_LAST_SPIN

                let address = await this.keyHandler.getPublicAddress()
                let timestamp = this.utils.getTimestampInMillis()
                let sign = await this._getSign(path, timestamp)
                let req = {
                    headers: {
                        authorization: {
                            address,
                            sign,
                            timestamp
                        }
                    },
                    id
                }
                this.socket.emit(path, req)
                this.getLastSpinResponseSubscription(req, ({ req, res }) =>
                    resolve({
                        req,
                        res
                    })
                )
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * Notify the house when the user would like to finalize a channel to ensure the user can't spin while the
     * close channel transaction is being sent to the network
     *  */
    finalizeChannel = (id, spin, aesKey) => {
        return new Promise(async (resolve, reject) => {
            try {
                let encryptedSpin = await Utils.encryptAES(
                    JSON.stringify(spin),
                    aesKey
                ).toString()

                let address = await this.keyHandler.getPublicAddress()
                let path = PATH_POST_FINALIZE_CHANNEL
                let timestamp = this.utils.getTimestampInMillis()
                let sign = await this._getSign(path, timestamp)
                let req = {
                    headers: {
                        authorization: {
                            address,
                            sign,
                            timestamp
                        }
                    },
                    id,
                    spin,
                    encryptedSpin
                }

                this.socket.emit(path, req)
                this.getFinalizeChannelResponseSubscription(
                    req,
                    ({ req, res }) =>
                        resolve({
                            req,
                            res
                        })
                )
            } catch (e) {
                reject(e)
            }
        })
    }

    /** Solidity ecsign implementation */
    signString = async text => {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        return new Promise(async (resolve, reject) => {
            let msgHash = ethUtil.sha3(text)
            let { privateKey } = await this.keyHandler.getWalletValues()
            privateKey = ethUtil.toBuffer(privateKey)
            let defaultAccount = await this.keyHandler.getPublicAddress()
            console.log(
                'Signing',
                text,
                ethUtil.bufferToHex(msgHash),
                'as',
                defaultAccount,
                ethUtil.isValidPrivate(privateKey)
            )

            const { v, r, s } = ethUtil.ecsign(msgHash, privateKey)
            const sgn = ethUtil.toRpcSig(v, r, s)

            console.log(
                'v: ' +
                    v +
                    ', r: ' +
                    sgn.slice(0, 66) +
                    ', s: 0x' +
                    sgn.slice(66, 130)
            )

            let m = ethUtil.toBuffer(msgHash)
            let pub = ethUtil.ecrecover(m, v, r, s)
            let adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')

            console.log('Generated sign address', adr, defaultAccount)

            console.log('Generated msgHash', msgHash, 'Sign', sgn)
            let address = await this.keyHandler.getPublicAddress()
            if (address && adr !== address.toLowerCase())
                reject(new Error('Invalid address for signed message'))

            resolve({ msgHash: msgHash, sig: sgn })
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
