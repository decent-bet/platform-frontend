import Helper from '../Helper'
import { KeyHandler } from '../../Web3'

const helper = new Helper()
const keyHandler = new KeyHandler()

const LOCAL_URL = 'http://localhost:3010/api'
const PUBLIC_URL = 'https://slots-api.decent.bet/api'

const BASE_URL = helper.isDev() ? LOCAL_URL : PUBLIC_URL

const cryptoJs = require("crypto-js")
const ethUtil = require('ethereumjs-util')

const request = require('request')

class DecentAPI {

    /** Off-chain finally verifiable slot spins */
    spin = async (address, spin, aesKey, callback) => {
        /**
         * Spin:
         * {
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
         * }
         *
         * aesKey - send encrypted spin to server to save state
         */
        let encryptedSpin = cryptoJs.AES.encrypt(JSON.stringify(spin), aesKey).toString()
        let url = '/casino/channels/slots/' + address + '/spin'

        let timestamp = helper.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        let options = {
            url: BASE_URL + url,
            method: 'POST',
            body: {
                spin: spin,
                encryptedSpin: encryptedSpin
            },
            headers: {
                Authorization: JSON.stringify({
                    sign: sign,
                    timestamp: timestamp
                })
            },
            json: true
        }
        // console.log('Sending spin: ' + JSON.stringify(options.body) + ' to house')
        request(options, (err, response, body) => {
            console.log('Process spin', err, body)
            callback(err, body)
        })
    }

    /**
     * Get the latest encrypted spin saved by the house
     **/
    getLastSpin = async (id, callback) => {
        let url = '/casino/channels/slots/' + id + '/spin'

        let timestamp = helper.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        let options = {
            url: BASE_URL + url,
            method: 'GET',
            headers: {
                Authorization: JSON.stringify({
                    sign: sign,
                    timestamp: timestamp
                })
            }
        }
        request(options, (err, response, body) => {
            try {
                body = JSON.parse(body)
            } catch (e) {

            }
            callback(err, body)
        })
    }

    /**
     * Notify the house when the user would like to finalize a channel to ensure the user can't spin while the
     * close channel transaction is being sent to the network
     *  */
    finalizeChannel = async (id, spin, aesKey, callback) => {
        let encryptedSpin = cryptoJs.AES.encrypt(JSON.stringify(spin), aesKey).toString()
        let url = '/casino/channels/slots/' + id + '/finalize'

        let timestamp = helper.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        let options = {
            url: BASE_URL + url,
            method: 'POST',
            headers: {
                Authorization: JSON.stringify({
                    sign: sign,
                    timestamp: timestamp
                })
            },
            body: {
                spin: spin,
                encryptedSpin: encryptedSpin
            },
            json: true
        }
        request(options, (err, response, body) => {
            console.log('Finalize Channel', err, body)
            callback(err, body)
        })
    }

    /** Solidity ecsign implementation */
    signString = async (text) => {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        return new Promise((resolve, reject) => {
            let msgHash = ethUtil.sha3(text)
            let privateKey = ethUtil.toBuffer(keyHandler.get())

            console.log('Signing', text, ethUtil.bufferToHex(msgHash), 'as', helper.getWeb3().eth.defaultAccount,
                ethUtil.isValidPrivate(privateKey))

            const {v, r, s} = ethUtil.ecsign(msgHash, privateKey)
            const sgn = ethUtil.toRpcSig(v, r, s)

            console.log('v: ' + v + ', r: ' + sgn.slice(0, 66) + ', s: 0x' + sgn.slice(66, 130))

            let m = ethUtil.toBuffer(msgHash)
            let pub = ethUtil.ecrecover(m, v, r, s)
            let adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')

            console.log('Generated sign address', adr, helper.getWeb3().eth.defaultAccount)

            console.log('Generated msgHash', msgHash, 'Sign', sgn)

            if (adr !== (helper.getWeb3().eth.defaultAccount).toLowerCase()) reject(new Error("Invalid address for signed message"))

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

export default DecentAPI
