import DecentAPI from '../../Components/Base/DecentAPI'
import Helper from '../../Components/Helper'
import SlotsConstants from './Constants'
import { SHA256 } from 'crypto-js'
import async from 'async'
import BigNumber from 'bignumber.js'
import {getSpin, getTightlyPackedSpin} from './functions'
import Bluebird from 'bluebird'

const decentApi = new DecentAPI()
const helper = new Helper()
const slotsConstants = new SlotsConstants()

const slotReels = slotsConstants.reels
const paytable = slotsConstants.paytable

export default class SlotsChannelHandler {
    /**
     *
     * @param betSize
     * @param state
     * @param callback
     */
    spin = async (betSize, state, callback) => {
        const id = state.channelId
        betSize = helper.convertToEther(betSize)

        try {
            let userSpin = await getSpin(betSize, state)
            let response = await Bluebird.fromCallback(cb => 
                decentApi.spin(id, userSpin, state.aesKey, cb) 
            )

            if (response.error) {
                throw new Error(response.message)
            }

            let houseSpin = response.message
            await Bluebird.fromCallback(cb => 
                this.helpers().verifyHouseSpin(state, houseSpin, userSpin, cb)
            )

            let lines = this.helpers().getLines(response.message.reel)
            // Increase nonce and add response.message to houseSpins in callback
            callback(false, response.message, lines)
        } catch (error) {
            callback(true, error.message)
        }
    }

    helpers = () => {
        const self = this
        return {
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

                        let msg = getTightlyPackedSpin(nonSignatureSpin)
                        let sign = houseSpin.sign

                        console.log('sign', sign)
                        console.log('Tightly packed spin', msg)

                        const valid = helper.getContractHelper()
                                            .verifySign(msg, houseSpin.sign, state.houseAuthorizedAddress)

                        if (!valid)
                            callback(true, 'Invalid signature')
                        else
                            callback(null)
                    },
                    /**
                     * Verify spin balances
                     * @param callback
                     */
                        (callback) => {

                        let reel = houseSpin.reel

                        if (userSpin.betSize !== houseSpin.betSize)
                            callback(true, 'Invalid betsize')

                        let betSize = parseInt(houseSpin.betSize, 10)
                        let payout = helper.convertToEther(self.helpers().calculateReelPayout(reel, betSize))
                        let userBalance, houseBalance

                        userBalance = (payout === 0) ?
                            (new BigNumber(userSpin.userBalance).minus(betSize)) :
                            (new BigNumber(userSpin.userBalance).plus(payout).minus(betSize))
                        houseBalance = (payout === 0) ?
                            (new BigNumber(userSpin.houseBalance).plus(betSize)) :
                            (new BigNumber(userSpin.houseBalance).minus(payout).plus(betSize))

                        // Balances below 0 should be corrected to 0 to ensure no party receives more tokens than
                        // what is available in the created channel.
                        if (userBalance.isLessThanOrEqualTo(0)) {
                            houseBalance = houseBalance.add(userBalance)
                            userBalance = new BigNumber(0)
                        } else if (houseBalance.isLessThanOrEqualTo(0)) {
                            userBalance = userBalance.add(houseBalance)
                            houseBalance = new BigNumber(0)
                        }

                        userBalance = userBalance.toFixed()
                        houseBalance = houseBalance.toFixed()

                        if (new BigNumber(houseSpin.betSize).isLessThan(helper.convertToEther(1)) ||
                            new BigNumber(houseSpin.betSize).isGreaterThan(helper.convertToEther(5)))
                            callback(true, 'Invalid betSize')
                        else if (houseSpin.userBalance !== userBalance ||
                            houseSpin.houseBalance !== houseBalance) {
                            console.log('Invalid balances', houseSpin.userBalance, userBalance,
                                houseSpin.houseBalance, houseBalance)
                            callback(true, 'Invalid balances', houseSpin.userBalance, userBalance,
                                houseSpin.houseBalance, houseBalance)
                        } else
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
                            else if (SHA256(houseSpin.prevReelSeedHash).toString() !==
                                houseSpin.reelSeedHash)
                                callback(true, 'Invalid reel seed hash')
                            else if (houseSpin.userHash !== userSpin.userHash)
                                callback(true, 'Invalid user hash')
                            else if (houseSpin.prevUserHash !== userSpin.prevUserHash)
                                callback(true, 'Invalid user hash')
                            else if (SHA256(houseSpin.reelSeedHash + houseSpin.reel.toString())
                                    .toString() !== houseSpin.reelHash)
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
            
            // Get the symbol that matches with a position on a reel
            getSymbol: (reel, position) => {
                if (position === 21)
                    position = 0;
                else if (position === -1)
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
                    if (line[i] === line[i - 1])
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
                            if (i === 0 || i === 4)
                                line[i] = self.helpers().getSymbol(i, reel[i] - 1);
                            else if (i === 2)
                                line[i] = self.helpers().getSymbol(i, reel[i] + 1);
                            else
                                line[i] = self.helpers().getSymbol(i, reel[i]);
                        }
                        break
                    case 4:
                        for (let i = 0; i < slotsConstants.NUMBER_OF_REELS; i++) {
                            if (i === 0 || i === 4)
                                line[i] = self.helpers().getSymbol(i, reel[i] + 1);
                            else if (i === 2)
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
