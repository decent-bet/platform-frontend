import {
    reels as slotReels,
    paytable,
    NUMBER_OF_LINES,
    NUMBER_OF_REELS
} from '../../constants'
import { SHA256 } from 'crypto-js'
import BigNumber from 'bignumber.js'

export default class SlotsChannelHandler {
    constructor(wsApi, utils) {
        this.wsApi = wsApi
        this.utils = utils
    }

    /**
     *
     * @param betSize
     * @param state
     * @param callback
     */
    async spin(betSize, state, callback) {
        const id = state.channelId
        betSize = this.utils.convertToEther(betSize)

        try {
            let userSpin = await this.utils.getSpin(betSize, state, false)
            let { res } = await this.wsApi.spin(id, userSpin, state.aesKey)

            if (!res) throw new Error('Not response received from channels api')

            if (res.error)
                throw new Error(res.message ? res.message : res.error)

            if (callback) {
                let houseSpin = res.message
                let lines = this.getLines(res.message.reel)
                callback(null, res.message, userSpin, houseSpin, lines)
            }
        } catch (error) {
            console.error(error)
            if (callback) callback(error)
        }
    }

    verifyHouseSpin = (state, houseSpin, userSpin) => {
        /**
         * Verify the spin -> run ecrecover on spin and check whether the address
         * matches the channel's player address
         *
         */
        return new Promise((resolve, reject) => {
            let nonSignatureSpin = this.utils.duplicate(houseSpin)
            delete nonSignatureSpin.sign

            const msg = this.utils.getTightlyPackedSpin(nonSignatureSpin)
            const valid = this.utils.verifySign(
                msg,
                houseSpin.sign,
                state.houseAuthorizedAddress
            )

            if (!valid) {
                reject(new Error('Invalid signature'))
            } else {
                /**
                 * Verify spin balances
                 */
                let reel = houseSpin.reel

                if (houseSpin.nonce < 1 || houseSpin.nonce >= 1000) {
                    reject(new Error('Invalid nonce'))
                } else if (userSpin.betSize !== houseSpin.betSize) {
                    reject(new Error('Invalid betSize'))
                } else {
                    let betSize = BigNumber(houseSpin.betSize)
                    let payout = this.utils.convertToEther(
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
                        houseBalance = houseBalance.plus(userBalance)
                        userBalance = new BigNumber(0)
                    } else if (houseBalance.isLessThanOrEqualTo(0)) {
                        userBalance = userBalance.plus(houseBalance)
                        houseBalance = new BigNumber(0)
                    }

                    userBalance = userBalance.toFixed()
                    houseBalance = houseBalance.toFixed()

                    if (!this.validateBetSize(houseSpin.betSize))
                        reject(new Error('Invalid betSize'))
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
                        reject(new Error('Invalid balances'))
                    } else {
                        /**
                         * Verify spin hashes
                         */
                        if (userSpin.nonce > 1) {
                            let prevHouseSpin =
                                state.houseSpins[state.houseSpins.length - 1]
                            if (
                                houseSpin.reelSeedHash !==
                                prevHouseSpin.prevReelSeedHash
                            )
                                reject(new Error('Invalid reel seed hash'))
                            else if (
                                SHA256(
                                    houseSpin.prevReelSeedHash
                                ).toString() !== houseSpin.reelSeedHash
                            )
                                reject(new Error('Invalid reel seed hash'))
                            else if (houseSpin.userHash !== userSpin.userHash)
                                reject(new Error('Invalid user hash'))
                            else if (
                                houseSpin.prevUserHash !== userSpin.prevUserHash
                            )
                                reject(new Error('Invalid user hash'))
                            else if (
                                SHA256(
                                    houseSpin.reelSeedHash +
                                        houseSpin.reel.toString()
                                ).toString() !== houseSpin.reelHash
                            )
                                reject(new Error('Invalid reel hash'))
                            else resolve()
                        } else {
                            if (houseSpin.userHash !== userSpin.userHash)
                                reject(new Error('Invalid user hash'))
                            else if (
                                houseSpin.prevUserHash !== userSpin.prevUserHash
                            )
                                reject(new Error('Invalid user hash'))
                            else resolve()
                        }
                    }
                }
            }
        })
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
        if (!isValid) return 0
        let lines = this.getLines(reel)
        let totalReward = 0
        for (let i = 0; i < adjustedBetSize; i++)
            totalReward += this.getLineRewardMultiplier(lines[i])
        return totalReward * this.getBetDivisor(betSize)
    }

    getAdjustedBetSize = betSize =>
        new BigNumber(betSize)
            .dividedBy(this.utils.getEtherInWei())
            .dividedBy(this.getBetDivisor(betSize))
            .toNumber()

    getBetDivisor = betSize => {
        let ethBetSize = new BigNumber(betSize)
            .dividedBy(this.utils.getEtherInWei())
            .toNumber()
        let tenthEthBetSize = new BigNumber(betSize)
            .dividedBy(this.utils.getEtherInWei())
            .multipliedBy(10)
            .toNumber()
        let hundredthEthBetSize = new BigNumber(betSize)
            .dividedBy(this.utils.getEtherInWei())
            .multipliedBy(100)
            .toNumber()

        if (ethBetSize <= 5 && ethBetSize >= 1) return 1
        else if (tenthEthBetSize <= 5 && tenthEthBetSize >= 1) return 0.1
        else if (hundredthEthBetSize <= 5 && hundredthEthBetSize >= 1)
            return 0.01
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
            console.log('getLine', i, reel, lines)
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
