import { units } from 'ethereum-units'
import BigNumber from 'bignumber.js'

/**
 * Parses the user's balance on a state channel
 * @param {StateChannel} channel
 */
export function channelBalanceParser(channel) {
    let totalTokens = channel.info ? channel.info.initialDeposit : 0
    if (channel.houseSpins && channel.houseSpins.length > 0) {
        const lastIdx = channel.houseSpins.length - 1
        const rawBalance = channel.houseSpins[lastIdx].userBalance
        totalTokens = new BigNumber(rawBalance)
    }
    return totalTokens.dividedBy(units.ether).toFixed(0)
}

/**
 * Has the channel been claimed?
 * @param {StateChannel} channel
 * @returns {boolean}
 */
export function isChannelClaimed(channel) {
    if (!channel.info) return false
    return channel.info.finalized && channel.deposited.isLessThanOrEqualTo(0)
}
