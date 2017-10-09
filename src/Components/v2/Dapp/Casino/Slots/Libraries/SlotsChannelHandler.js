/**
 * Created by user on 10/3/2017.
 */

import DecentAPI from '../../../../Base/DecentAPI'
import Helper from '../../../../Helper'

import SlotsConstants from './Constants'

import sha256 from 'crypto-js/sha256'

const async = require('async')
const BigNumber = require('bignumber.js')
const cryptoJs = require("crypto-js")

const decentApi = new DecentAPI()
const helper = new Helper()

const slotsConstants = new SlotsConstants()
const slotReels = slotsConstants.reels
const paytable = slotsConstants.paytable

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

    /**
     * Get info and hashes required to interact with an active channel
     * @param id
     * @param callback
     */
    getChannelDetails = (id, callback) => {
        async.parallel({
            info: (cb) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .getChannelInfo(id).then((info) => {
                    console.log('Info', info)
                    cb(false, {
                        exists: info[0],
                        playerAddress: info[1],
                        ready: info[2],
                        activated: info[3],
                        initialDeposit: info[4]
                    })
                }).catch((err) => {
                    console.log('Error retrieving channel details', err.message)
                    cb(true, err.message)
                })
            },
            hashes: (cb) => {
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .getChannelHashes(id).then((hashes) => {
                    console.log('Hashes', hashes)
                    cb(false, {
                        finalUserHash: hashes[0],
                        initialUserNumber: hashes[1],
                        initialHouseSeedHash: hashes[2],
                        finalReelHash: hashes[3],
                        finalSeedHash: hashes[4]
                    })
                }).catch((err) => {
                    console.log('Error retrieving channel hashes', err.message)
                    cb(true, err.message)
                })
            }
        }, (err, results) => {
            callback(err, results)
        })
    }

    /**
     * Loads the last spin for an active channel
     * @param id
     * @param hashes
     * @param aesKey
     * @param callback
     */
    loadLastSpin = (id, hashes, aesKey, callback) => {
        const self = this
        decentApi.getLastSpin(id, (err, result) => {
            if (!err) {
                let encryptedSpin = result.userSpin
                let houseSpin = result.houseSpin
                let nonce = result.nonce + 1
                let userSpin, houseSpins
                if (encryptedSpin) {
                    try {
                        userSpin = JSON.parse(cryptoJs.AES.decrypt(encryptedSpin, aesKey)
                            .toString(cryptoJs.enc.Utf8))
                    } catch (e) {

                    }
                }
                if (houseSpin)
                    houseSpins = [houseSpin]
                else
                    houseSpins = []
                let isValid = self.helpers().isValidInitialUserNumber(
                    aesKey,
                    hashes.initialUserNumber,
                    hashes.finalUserHash)
                console.log('Load last spin', nonce, houseSpins)
                callback(!isValid, isValid ? {
                        nonce: nonce,
                        houseSpins: houseSpins,
                        userHashes: self.helpers().getUserHashes(hashes.initialUserNumber)
                    } : 'Invalid initial user number')
            } else
                callback(true, result)
        })
    }

    /**
     *
     * @param betSize
     * @param state
     * @param callback
     */
    spin = (betSize, state, callback) => {
        const self = this
        const id = state.id
        betSize = helper.convertToEther(betSize)
        this.helpers().getSpin(betSize, state, (err, userSpin) => {
            if (!err) {
                console.log('getSpin', userSpin)
                decentApi.spin(id, userSpin, state.aesKey, (err, response) => {
                    console.log('decentApi.spin', err, response)
                    if (!err) {
                        if (!response.error) {
                            let houseSpin = response.message
                            self.helpers().verifyHouseSpin(state, houseSpin, userSpin, (err, message) => {
                                console.log('verifyHouseSpin', err, message)
                                if (!err) {
                                    if (callback) {
                                        let lines = self.helpers().getLines(response.message.reel)
                                        // Increase nonce and add response.message to houseSpins in callback
                                        callback(false, response.message, lines)
                                    }
                                } else {
                                    if (callback)
                                        callback(true, message)
                                }
                            })
                        } else if (callback)
                            callback(true, response.message)
                    } else if (callback)
                        callback(true, 'Error retrieving house spin')
                })
            } else {
                if (callback)
                    callback(true, 'Error generating sign')
            }
        })
    }

    helpers = () => {
        const self = this
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
            },
            getSpin: (betSize, state, callback) => {

                const lastHouseSpin = state.houseSpins[state.houseSpins.length - 1]
                const nonce = state.nonce

                let reelHash = (nonce == 1) ? state.hashes.finalReelHash : lastHouseSpin.reelHash
                let reel = ''
                let reelSeedHash = (nonce == 1) ? state.hashes.finalSeedHash : lastHouseSpin.reelSeedHash
                let prevReelSeedHash = (nonce == 1 ) ? '' : lastHouseSpin.prevReelSeedHash
                let userHash = state.userHashes[state.userHashes.length - nonce]
                let prevUserHash = state.userHashes[state.userHashes.length - nonce - 1]
                let userBalance = ((nonce == 1) ? (state.info.initialDeposit) :
                    lastHouseSpin.userBalance)
                let houseBalance = ((nonce == 1) ? (state.info.initialDeposit) :
                    lastHouseSpin.houseBalance)

                let spin = {
                    reelHash: reelHash,
                    reel: reel,
                    reelSeedHash: reelSeedHash,
                    prevReelSeedHash: prevReelSeedHash,
                    userHash: userHash,
                    prevUserHash: prevUserHash,
                    nonce: nonce,
                    turn: false,
                    userBalance: userBalance,
                    houseBalance: houseBalance,
                    betSize: betSize
                }

                decentApi.signString(self.helpers().getTightlyPackedSpin(spin), (err, sign) => {
                    if (!err) {
                        spin.sign = sign.sig
                        callback(false, spin)
                    } else
                        callback(true)
                })
            },
            verifyHouseSpin: (state, houseSpin, userSpin, callback) => {
                async.waterfall([
                    /**
                     * Verify the spin -> run ecrecover on spin and check whether the address
                     * matches the channel's player address
                     *
                     * @param callback
                     */
                        (callback) => {

                        let nonSignatureSpin = helper.duplicate(houseSpin)
                        delete nonSignatureSpin.sign

                        let msg = self.helpers().getTightlyPackedSpin(nonSignatureSpin)

                        let msgHash = helper.getContractHelper().getWeb3().sha3(msg)

                        console.log('Tightly packed spin', msg)
                        console.log('msgHash', msgHash)
                        let sign = houseSpin.sign

                        helper.getContractHelper().getWrappers().slotsChannelManager()
                            .checkSig(state.id, msgHash, sign, houseSpin.turn).then((valid) => {
                            if (!valid)
                                callback(true, 'Invalid signature')
                            else
                                callback(null)
                        }).catch((err) => {
                            console.log('Checksig err', err.message)
                            callback(true, 'Error verifying signature. Please try again')
                        })
                    },
                    /**
                     * Verify spin balances
                     * @param callback
                     */
                        (callback) => {

                        let reel = houseSpin.reel

                        if (userSpin.betSize !== houseSpin.betSize)
                            callback(true, 'Invalid betsize')

                        let betSize = parseInt(houseSpin.betSize)
                        let payout = helper.convertToEther(self.helpers().calculateReelPayout(reel, betSize))
                        let userBalance, houseBalance

                        userBalance = (payout == 0) ?
                            (new BigNumber(userSpin.userBalance).minus(betSize).toString()) :
                            (new BigNumber(userSpin.userBalance).plus(payout).minus(betSize).toString())
                        houseBalance = (payout == 0) ?
                            (new BigNumber(userSpin.houseBalance).plus(betSize).toString()) :
                            (new BigNumber(userSpin.houseBalance).minus(payout).plus(betSize).toString())

                        if (new BigNumber(houseSpin.betSize).lessThan(helper.convertToEther(1)) ||
                            new BigNumber(houseSpin.betSize).greaterThan(helper.convertToEther(5)))
                            callback(true, 'Invalid betSize')
                        else if (houseSpin.userBalance !== userBalance ||
                            houseSpin.houseBalance !== houseBalance) {
                            console.log('Invalid balances', houseSpin.userBalance, userBalance,
                                houseSpin.houseBalance, houseBalance)
                            callback(true, 'Invalid balances', houseSpin.userBalance, userBalance,
                                houseSpin.houseBalance, houseBalance)
                        }
                        else
                            callback(false)
                    },
                    /**
                     * Verify spin hashes
                     * @param callback
                     */
                        (callback) => {
                        if (userSpin.nonce > 1) {
                            let prevHouseSpin = state.houseSpins[state.houseSpins.length - 1]
                            if (houseSpin.reelSeedHash !== prevHouseSpin.prevReelSeedHash)
                                callback(true, 'Invalid reel seed hash')
                            else if (sha256(houseSpin.prevReelSeedHash).toString() !==
                                houseSpin.reelSeedHash)
                                callback(true, 'Invalid reel seed hash')
                            else if (houseSpin.userHash !== userSpin.userHash)
                                callback(true, 'Invalid user hash')
                            else if (houseSpin.prevUserHash !== userSpin.prevUserHash)
                                callback(true, 'Invalid user hash')
                            else if (sha256(houseSpin.reelSeedHash + houseSpin.reel.toString())
                                    .toString() != houseSpin.reelHash)
                                callback(true, 'Invalid reel hash')
                            else
                                callback(false)
                        } else {
                            if (houseSpin.userHash !== userSpin.userHash)
                                callback(true, 'Invalid user hash')
                            else if (houseSpin.prevUserHash !== userSpin.prevUserHash)
                                callback(true, 'Invalid user hash')
                            else
                                callback(false)
                        }
                    }
                ], (err, result) => {
                    callback(err, result)
                })
            },
            isValidInitialUserNumber: (aesKey, initialUserNumber, finalUserHash) => {
                initialUserNumber = cryptoJs.AES.decrypt(initialUserNumber, aesKey).toString(cryptoJs.enc.Utf8)
                console.log('Unencrypted initial user number: ', initialUserNumber)
                let userHashes = self.helpers().getUserHashes(initialUserNumber)
                return (userHashes[userHashes.length - 1] == finalUserHash)
            },
            /**
             * Returns a tightly packed spin string
             * @param spin
             */
            getTightlyPackedSpin: (spin) => {
                return (spin.reelHash + (spin.reel !== '' ? spin.reel.toString() : '') +
                spin.reelSeedHash + spin.prevReelSeedHash + spin.userHash + spin.prevUserHash +
                spin.nonce + spin.turn + spin.userBalance + spin.houseBalance + spin.betSize)
            },
            // Get the symbol that matches with a position on a reel
            getSymbol: (reel, position) => {
                if (position == 21)
                    position = 0;
                else if (position == -1)
                    position = 20;
                return slotReels[reel][position]
            },
            // Calculates total payout for slotsConstants.NUMBER_OF_LINES lines in the given reel
            calculateReelPayout: (reel, betSize) => {
                betSize = helper.formatEther(betSize)
                let isValid = true
                for (let i = 0; i < reel.length; i++) {
                    if (reel[i] > 20) {
                        isValid = false;
                        break;
                    }
                }
                console.log('calculateReelPayout isValid: ' + isValid)
                if (!isValid) return 0;
                let lines = self.helpers().getLines(reel)
                let totalReward = 0
                console.log('calculateReelPayout lines: ' + JSON.stringify(lines) + ', ' + betSize + ', ' + typeof betSize)
                for (let i = 0; i < betSize; i++)
                    totalReward += (self.helpers().getLineRewardMultiplier(lines[i]))
                console.log('calculateReelPayout totalReward: ' + totalReward)
                return totalReward;
            },
            // Checks if a line is a winning line and returns the reward multiplier
            getLineRewardMultiplier: (line) => {
                console.log('getLineRewardMultiplier: ' + JSON.stringify(line))
                let repetitions = 1
                let rewardMultiplier = 0
                for (let i = 1; i <= line.length; i++) {
                    if (line[i] == line[i - 1])
                        repetitions++
                    else
                        break
                }
                if (repetitions >= 3) {
                    console.log('--- WIN ---')
                    console.log('Repetitions: ' + repetitions)
                    console.log('Line: ' + line[0])
                    console.log('Pay table: ' + paytable[line[0]])
                    rewardMultiplier = paytable[line[0]] * (repetitions - 2)
                    console.log('Reward Multiplier: ' + rewardMultiplier)
                }
                return rewardMultiplier
            },
            // Returns NUMBER_OF_LINES lines containing NUMBER_OF_REELS symbols each
            getLines: (reel) => {
                let lines = [];
                for (let i = 0; i < slotsConstants.NUMBER_OF_LINES; i++) {
                    lines.push(self.helpers().getLine(i, reel))
                }
                return lines;
            },
            // Returns line for an index
            getLine: (lineIndex, reel) => {
                let line = []
                switch (lineIndex) {
                    case 0:
                        for (let i = 0; i < slotsConstants.NUMBER_OF_REELS; i++) {
                            line[i] = self.helpers().getSymbol(i, reel[i])
                        }
                        break
                    case 1:
                        for (let i = 0; i < slotsConstants.NUMBER_OF_REELS; i++) {
                            line[i] = self.helpers().getSymbol(i, reel[i] - 1)
                        }
                        break
                    case 2:
                        for (let i = 0; i < slotsConstants.NUMBER_OF_REELS; i++) {
                            line[i] = self.helpers().getSymbol(i, reel[i] + 1)
                        }
                        break
                    case 3:
                        for (let i = 0; i < slotsConstants.NUMBER_OF_REELS; i++) {
                            if (i == 0 || i == 4)
                                line[i] = self.helpers().getSymbol(i, reel[i] - 1);
                            else if (i == 2)
                                line[i] = self.helpers().getSymbol(i, reel[i] + 1);
                            else
                                line[i] = self.helpers().getSymbol(i, reel[i]);
                        }
                        break
                    case 4:
                        for (let i = 0; i < slotsConstants.NUMBER_OF_REELS; i++) {
                            if (i == 0 || i == 4)
                                line[i] = self.helpers().getSymbol(i, reel[i] + 1);
                            else if (i == 2)
                                line[i] = self.helpers().getSymbol(i, reel[i] - 1);
                            else
                                line[i] = self.helpers().getSymbol(i, reel[i]);
                        }
                        break
                    default:
                        break
                }
                return line
            }
        }
    }

}
