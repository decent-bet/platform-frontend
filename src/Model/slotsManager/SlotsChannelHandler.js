import DecentAPI from '../../Components/Base/DecentAPI'
import { Utils } from '../../Web3/Utils'

import Helper from '../../Components/Helper'
import {
    reels as slotReels,
    paytable,
    NUMBER_OF_LINES,
    NUMBER_OF_REELS
} from './Constants'
import { SHA256 } from 'crypto-js'
import BigNumber from 'bignumber.js'
import { getSpin, getTightlyPackedSpin } from './functions'
import Bluebird from 'bluebird'
const helper = new Helper()

export default class SlotsChannelHandler {

    constructor(web3) {
        this.decentApi = new DecentAPI(web3)
    }
    /**
     *
     * @param betSize
     * @param state
     * @param callback
     */
    spin = async (betSize, state, chainProvider, callback) => {
        const id = state.channelId
        betSize = helper.convertToEther(betSize)

        try {
            let userSpin = await getSpin(betSize, state, false, chainProvider)
            let response = await Bluebird.fromCallback(cb =>
                this.decentApi.spin(id, userSpin, state.aesKey, cb)
            )

            if (response.error) {
                throw new Error(response.message)
            }

            let houseSpin = response.message
            await Bluebird.fromCallback(cb =>
                this.verifyHouseSpin(state, houseSpin, userSpin, cb)
            )

            let lines = this.getLines(response.message.reel)
            // Increase nonce and add response.message to houseSpins in callback
            callback(null, response.message, lines)
        } catch (error) {
            callback(error.message)
        }
    }

    verifyHouseSpin = (state, houseSpin, userSpin, callback) => {
        /**
         * Verify the spin -> run ecrecover on spin and check whether the address
         * matches the channel's player address
         *
         */

        let nonSignatureSpin = helper.duplicate(houseSpin)
        delete nonSignatureSpin.sign

        const msg = getTightlyPackedSpin(nonSignatureSpin)
        const valid = Utils.verifySign(msg, houseSpin.sign, state.houseAuthorizedAddress)
        if (!valid)
            callback(true, 'Invalid signature')

        /**
         * Verify spin balances
         */
        let reel = houseSpin.reel

        if(houseSpin.nonce < 1 || houseSpin.nonce >= 1000)
            callback(true, 'Invalid nonce')

        if (userSpin.betSize !== houseSpin.betSize)
            callback(true, 'Invalid betsize')

        let betSize = parseInt(houseSpin.betSize, 10)
        let payout = helper.convertToEther(
            this.calculateReelPayout(reel, betSize)
        )

        let userBalance =
            payout === 0
                ? new BigNumber(userSpin.userBalance).minus(betSize)
                : new BigNumber(userSpin.userBalance)
                      .plus(payout)
                      .minus(betSize)
        let houseBalance =
            payout === 0
                ? new BigNumber(userSpin.houseBalance).plus(betSize)
                : new BigNumber(userSpin.houseBalance)
                      .minus(payout)
                      .plus(betSize)

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

        if (!this.validateBetSize(houseSpin.betSize))
            callback(true, 'Invalid betSize')
        else if (
            houseSpin.userBalance !== userBalance ||
            houseSpin.houseBalance !== houseBalance
        ) {
            console.log(
                'Invalid balances',
                houseSpin.userBalance,
                userBalance,
                houseSpin.houseBalance,
                houseBalance
            )
            callback(
                true,
                'Invalid balances',
                houseSpin.userBalance,
                userBalance,
                houseSpin.houseBalance,
                houseBalance
            )
        }
        /**
         * Verify spin hashes
         */
        if (userSpin.nonce > 1) {
            let prevHouseSpin = state.houseSpins[state.houseSpins.length - 1]
            if (houseSpin.reelSeedHash !== prevHouseSpin.prevReelSeedHash)
                callback(true, 'Invalid reel seed hash')
            else if (
                SHA256(houseSpin.prevReelSeedHash).toString() !==
                houseSpin.reelSeedHash
            )
                callback(true, 'Invalid reel seed hash')
            else if (houseSpin.userHash !== userSpin.userHash)
                callback(true, 'Invalid user hash')
            else if (houseSpin.prevUserHash !== userSpin.prevUserHash)
                callback(true, 'Invalid user hash')
            else if (
                SHA256(
                    houseSpin.reelSeedHash + houseSpin.reel.toString()
                ).toString() !== houseSpin.reelHash
            )
                callback(true, 'Invalid reel hash')
            else callback(false)
        } else {
            if (houseSpin.userHash !== userSpin.userHash)
                callback(true, 'Invalid user hash')
            else if (houseSpin.prevUserHash !== userSpin.prevUserHash)
                callback(true, 'Invalid user hash')
            else callback(false)
        }
    }

    // Get the symbol that matches with a position on a reel
    getSymbol = (reel, position) => {
        if (position === 21) position = 0
        else if (position === -1) position = 20
        return slotReels[reel][position]
    }

    // Calculates total payout for slotsConstants.NUMBER_OF_LINES lines in the given reel
    calculateReelPayout = (reel, betSize) => {
        let adjustedBetSize = this.getAdjustedBetSize(betSize)
        let isValid = true
        for (let i = 0; i < reel.length; i++) {
            if (reel[i] > 20) {
                isValid = false
                break
            }
        }
        console.log('calculateReelPayout isValid: ' + isValid)
        if (!isValid) return 0
        let lines = this.getLines(reel)
        let totalReward = 0
        console.log(
            'calculateReelPayout lines: ' +
                JSON.stringify(lines) +
                ', ' +
                adjustedBetSize +
                ', ' +
                typeof adjustedBetSize
        )
        for (let i = 0; i < adjustedBetSize; i++)
            totalReward += this.getLineRewardMultiplier(lines[i])
        console.log('calculateReelPayout totalReward: ' + totalReward)
        return totalReward
    }

    getAdjustedBetSize = betSize => {
        let ethBetSize = new BigNumber(betSize)
            .dividedBy(helper.getEtherInWei())
            .toNumber()
        let tenthEthBetSize = new BigNumber(betSize)
            .dividedBy(helper.getEtherInWei())
            .multipliedBy(10)
            .toNumber()
        let hundredthEthBetSize = new BigNumber(betSize)
            .dividedBy(helper.getEtherInWei())
            .multipliedBy(100)
            .toNumber()

        if (ethBetSize <= 5 && ethBetSize >= 1) return ethBetSize
        else if (tenthEthBetSize <= 5 && tenthEthBetSize >= 1)
            return tenthEthBetSize
        else if (hundredthEthBetSize <= 5 && hundredthEthBetSize >= 1)
            return hundredthEthBetSize
        else return 0
    }

    validateBetSize = betSize => {
        return this.getAdjustedBetSize(betSize) !== 0
    }

    // Checks if a line is a winning line and returns the reward multiplier
    getLineRewardMultiplier = line => {
        let repetitions = 1
        let rewardMultiplier = 0
        for (let i = 1; i <= line.length; i++) {
            if (line[i] === line[i - 1]) repetitions++
            else break
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
    }

    // Returns NUMBER_OF_LINES lines containing NUMBER_OF_REELS symbols each
    getLines = reel => {
        let lines = []
        for (let i = 0; i < NUMBER_OF_LINES; i++) {
            lines.push(this.getLine(i, reel))
        }
        return lines
    }

    // Returns line for an index
    getLine = (lineIndex, reel) => {
        let line = []
        switch (lineIndex) {
            case 0:
                for (let i = 0; i < NUMBER_OF_REELS; i++) {
                    line[i] = this.getSymbol(i, reel[i])
                }
                break
            case 1:
                for (let i = 0; i < NUMBER_OF_REELS; i++) {
                    line[i] = this.getSymbol(i, reel[i] - 1)
                }
                break
            case 2:
                for (let i = 0; i < NUMBER_OF_REELS; i++) {
                    line[i] = this.getSymbol(i, reel[i] + 1)
                }
                break
            case 3:
                for (let i = 0; i < NUMBER_OF_REELS; i++) {
                    if (i === 0 || i === 4)
                        line[i] = this.getSymbol(i, reel[i] - 1)
                    else if (i === 2) line[i] = this.getSymbol(i, reel[i] + 1)
                    else line[i] = this.getSymbol(i, reel[i])
                }
                break
            case 4:
                for (let i = 0; i < NUMBER_OF_REELS; i++) {
                    if (i === 0 || i === 4)
                        line[i] = this.getSymbol(i, reel[i] + 1)
                    else if (i === 2) line[i] = this.getSymbol(i, reel[i] - 1)
                    else line[i] = this.getSymbol(i, reel[i])
                }
                break
            default:
                break
        }
        return line
    }
}
