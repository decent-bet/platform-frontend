/**
 * Created by user on 10/3/2017.
 */

import Helper from '../../../../Helper'

import sha256 from 'crypto-js/sha256'

const cryptoJs = require("crypto-js")

const helper = new Helper()

export default class SlotsChannelHandler {

    /**
     * Returns parameters required to call the depositToChannel function - initialRandomNumber and finalUserHash
     *
     * Initial User Number is generated using an 18 digit random number which's AES-256 encrypted with a key that is
     * a SHA3 of the channel id signed with the user's account
     *
     *
     * @param id
     * @param callback
     */
    getChannelDepositParams = (id, callback) => {
        const self = this
        let randomNumber = this.helpers().randomNumber(18).toString()

        this.helpers().getAesKey(id, (err, res) => {
            if (!err) {
                console.log('randomNumber', randomNumber, 'aesKey', res)
                let initialUserNumber = cryptoJs.AES.encrypt(randomNumber, res).toString()
                let userHashes = self.helpers().getUserHashes(randomNumber)
                let finalUserHash = userHashes[userHashes.length - 1]
                callback(false, {
                    initialUserNumber: initialUserNumber,
                    finalUserHash: finalUserHash
                })
            } else
                callback(true, res)
        })
    }

    helpers = () => {
        return {
            randomNumber: (length) => {
                return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1))
            },
            getAesKey: (id, cb) => {
                let idHash = helper.getWeb3().sha3(id)
                helper.getWeb3().eth.sign(helper.getWeb3().eth.defaultAccount, idHash, (err, sign) => {
                    if (!err) {
                        cb(false, sign)
                    } else
                        cb(true, 'Error signing id hash')
                })
            },
            getUserHashes: (randomNumber) => {
                let lastHash
                let hashes = []
                for (let i = 0; i < 1000; i++) {
                    let hash = sha256(i == 0 ? randomNumber : lastHash).toString()
                    hashes.push(hash)
                    lastHash = hash
                }
                return hashes
            }
        }
    }

}
