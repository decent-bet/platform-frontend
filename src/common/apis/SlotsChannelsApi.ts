import { getStageConfig } from '../../config'
const cryptoJs = require("crypto-js")
const request = require('request')

export default class SlotsChannelsApi {

    constructor(private keyHandler, private utils) { }

    get baseUrl() {
        let stage = this.keyHandler.getStage()
        let config = getStageConfig(stage)
        return config.channelsApiUrl
    }
    
    /** Off-chain finally verifiable slot spins */
    public spin = async (address, spin, aesKey, callback) => {
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
        console.log('Spin', address, spin, aesKey)
        let encryptedSpin = cryptoJs.AES.encrypt(JSON.stringify(spin), aesKey).toString()
        let url = '/casino/channels/slots/' + address + '/spin'

        let timestamp = this.utils.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        let options = {
            url: this.baseUrl + url,
            method: 'POST',
            body: {
                spin,
                encryptedSpin
            },
            headers: {
                Authorization: JSON.stringify({
                    sign,
                    timestamp
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
    public getLastSpin = async (id, cb) => {
        let url = '/casino/channels/slots/' + id + '/spin'

        let timestamp = this.utils.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        let options = {
            method: 'get',
            headers: {
                Authorization: JSON.stringify({
                    sign,
                    timestamp,
                })
            }
        }

        let res = await fetch(`${this.baseUrl}${url}`, options)
        let body = await res.json()
        cb(!res.ok, body)
    }

    /**
     * Notify the house when the user would like to finalize a channel to ensure the user can't spin while the
     * close channel transaction is being sent to the network
     *  */
    public finalizeChannel = async (id, spin, aesKey, callback) => {
        let encryptedSpin = cryptoJs.AES.encrypt(JSON.stringify(spin), aesKey).toString()
        let url = '/casino/channels/slots/' + id + '/finalize'

        let timestamp = this.utils.getTimestampInMillis()
        let sign = await this._getSign(url, timestamp)

        let options = {
            url: this.baseUrl + url,
            method: 'POST',
            headers: {
                Authorization: JSON.stringify({
                    sign,
                    timestamp
                })
            },
            body: {
                spin,
                encryptedSpin
            },
            json: true
        }
        request(options, (err, response, body) => {
            console.log('Finalize Channel', err, body)
            callback(err, body)
        })
    }

    private _getSign = async (path, timestamp) => {
        let input = path + timestamp
        let sign = await this.utils.signString(input, this.keyHandler)
        console.log('_getSign', input, sign)

        return sign.sig
    }

}
