/**
 * Created by user on 6/14/2017.
 */
import Helper from './../Helper'

const helper = new Helper()

const LOCAL_URL = 'http://localhost:3010/api'
const PUBLIC_URL = ''

const BASE_URL = helper.isDev() ? LOCAL_URL : PUBLIC_URL

const cryptoJs = require("crypto-js")
const ethUtil = require('ethereumjs-util')

const request = require('request')

class DecentAPI {

    /** Off-chain finally verifiable slot spins */
    spin = (address, spin, aesKey, callback) => {
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
        let url = BASE_URL + '/casino/channels/slots/' + address + '/spin'
        let options = {
            url: url,
            method: 'POST',
            body: {
                spin: spin,
                encryptedSpin: encryptedSpin
            },
            json: true
        }
        // console.log('Sending spin: ' + JSON.stringify(options.body) + ' to house')
        request(options, (err, response, body) => {
            callback(err, body)
        })
    }

    /**
     * Get the latest encrypted spin saved by the house
     **/
    getLastSpin = (address, callback) => {
        let url = BASE_URL + '/casino/channels/slots/' + address + '/spin'
        let options = {
            url: url,
            method: 'GET'
        }
        request(options, (err, response, body) => {
            callback(err, JSON.parse(body))
        })
    }

    /** Solidity ecsign implementation */
    signString = (text, callback) => {
        /*
         * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the user's address;
         */
        let msgHash = window.web3.sha3(text);
        console.log('Signing ' + msgHash + ' as ' + window.web3.eth.defaultAccount)
        window.web3.eth.sign(window.web3.eth.defaultAccount, msgHash, (err, sgn) => {
            if (!err) {
                let r = ethUtil.toBuffer(sgn.slice(0, 66))
                let s = ethUtil.toBuffer('0x' + sgn.slice(66, 130))
                let v = ethUtil.bufferToInt(ethUtil.toBuffer('0x' + sgn.slice(130, 132)))
                console.log('v: ' + v + ', r: ' + sgn.slice(0, 66) + ', s: ' + '0x' + sgn.slice(66, 130))
                let m = ethUtil.toBuffer(msgHash)
                let pub = ethUtil.ecrecover(m, v, r, s)
                let adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')
                if (adr !== window.web3.eth.defaultAccount) throw new Error("I guess this doesn't fix it.")
                console.log("Ta-da! " + adr + ', ' + window.web3.version.api)
                // sig = sig.substr(2);
                // console.log('Signed: ' + sig)
                // let r = '0x' + sig.substr(0, 64);
                // let s = '0x' + sig.substr(64, 64);
                // console.log('r: ' + r + ', s: ' + s + ', v: ' + sig.substr(128, 2))
                // let v = '0x' + sig.substr(128, 2);
                callback(false, {msgHash: msgHash, sig: sgn});
            } else
                callback(true, err)
        });
    }

    getSpinBuffer = (spin) => {
        let buffer = ethUtil.toBuffer(spin.reelHash)
        buffer = Buffer.concat([buffer, ethUtil.toBuffer((spin.reel != '' ? JSON.stringify(spin.reel) : ''))])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer(spin.reelSeedHash)])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer(spin.prevReelSeedHash)])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer(spin.userHash)])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer(spin.prevUserHash)])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer('' + spin.nonce)])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer(('' + spin.turn))])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer((spin.userBalance))])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer((spin.houseBalance))])
        buffer = Buffer.concat([buffer, ethUtil.toBuffer((spin.betSize))])
        return buffer
    }

    /**
     * Returns solidity sha3 of a spin used for checksig on contract
     * @param spin
     */
    getSha3Spin = (spin) => {
        return ethUtil.bufferToHex(ethUtil.sha3(this.getSpinBuffer(spin)))
    }

}

export default DecentAPI