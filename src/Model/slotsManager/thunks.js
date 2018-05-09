import Actions from './actions'

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
