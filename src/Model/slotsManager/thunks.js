import Actions from './actions'

// Used for VSCode Code Completion
import BigNumber from 'bignumber.js' // eslint-disable-line no-unused-vars

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId) {
    return async dispatch => {
        // Claim the channel, check token total in the contract, and withdraw tokens
        await dispatch(Actions.claimChannel(channelId))
        const tokensInContract = await dispatch(Actions.getBalance())
        await dispatch(Actions.withdrawChips(tokensInContract.value))
    }
}

/**
 * Builds a State Channel in a single step
 * @param {BigNumber} amount
 * @param {BigNumber} allowance
 * @returns {Promise<string>}
 */
export function buildChannel(amount, allowance) {
    return async dispatch => {
        // Approve Tokens if it needs more allowance
        if (allowance.isLessThan(amount)) {
            await dispatch(Actions.approveAndDepositChips(amount))
        } else {
            await dispatch(Actions.depositChips(amount))
        }

        // Create Channel
        const { value } = await dispatch(Actions.createChannel(amount))

        // Deposit Tokens to channel
        await dispatch(Actions.depositToChannel(value))

        // Query the channel's data and add it to the redux state
        await dispatch(Actions.getChannel(value))

        return value
    }
}
/**
 * Spin the slots, wait for the action to complete, AND THEN increase the nonce.
 * @param {string} channelId
 * @param {string} msg
 */
export function spinAndIncreaseNonce(channelId, msg) {
    return async dispatch2 => {
        await dispatch2(Actions.postSpin(channelId, msg))
        await dispatch2(Actions.nonceIncrease(channelId))
    }
}
