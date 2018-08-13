import Actions from './actions'
import { Actions as BalanceActions } from '../balance'

// Used for VSCode Code Completion
import BigNumber from 'bignumber.js' // eslint-disable-line no-unused-vars

export function initializeSlots() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(Actions.getSessionId(chainProvider))
        await dispatch(Actions.getBalance(chainProvider))
        await dispatch(Actions.getAllowance(chainProvider))
    }
}

export function fetchChannels() {
    return async (dispatch, getState, { chainProvider }) => {
        return await dispatch(Actions.getChannels(chainProvider))
    }
}

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId) {
    return async (dispatch, getState, { chainProvider }) => {
        // Claim the channel, check token total in the contract, and withdraw tokens
        await dispatch(Actions.claimChannel(channelId))
        const tokensInContract = await dispatch(
            Actions.getBalance(chainProvider)
        )
        await dispatch(Actions.withdrawChips(tokensInContract.value))

        // Update the ether balance
        await dispatch(BalanceActions.getEtherBalance(chainProvider))
    }
}

/**
 * Builds a State Channel in a single step
 * @param {BigNumber} amount
 * @param {BigNumber} allowance
 * @returns {Promise<string>}
 */
export function buildChannel(amount, allowance) {
    
    return async (dispatch, getState, { chainProvider }) => {
        // Approve Tokens if it needs more allowance
        if (allowance.isLessThan(amount)) {
            await dispatch(
                Actions.approveAndDepositChips(amount, chainProvider)
            )
        } else {
            await dispatch(Actions.depositChips(amount, chainProvider))
        }

        // Create Channel
        const { value } = await dispatch(
            Actions.createChannel(amount, chainProvider)
        )

        if (value) {
            // Deposit Tokens to channel
            await dispatch(Actions.depositToChannel(value, chainProvider))

            // Query the channel's data and add it to the redux state
            await dispatch(Actions.getChannel(value, chainProvider))

            // Update the ether balance
            await dispatch(BalanceActions.getEtherBalance(chainProvider))
            return value
        }

        return 0
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

export function initializeGame(channelId) {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(Actions.getAesKey(channelId, chainProvider))
        await dispatch(Actions.getChannelDetails(channelId, chainProvider))
        await dispatch(Actions.getLastSpin(channelId, chainProvider))
        await dispatch(watcherChannelFinalized(channelId))
        await dispatch(watcherChannelClaimed(channelId))
    }
}

// Watcher that monitors channel finalization
export function watcherChannelFinalized(channelId) {
    return async (dispatch, getState, { contractFactory }) => {
        const contract = contractFactory.slotsChannelManagerContract()
        try {
            const events = await contract.logChannelFinalized(channelId)
            if (events && events.length) {
                let [event] = events
                let id = event.returnValues.id.toString()
                await dispatch(Actions.setChannelFinalized(id))
            }
            return
        } catch (error) {
            console.error('Finalized channel event', error)
            return
        }
    }
}

// Watcher that monitors the claiming of a channel's Chips
export function watcherChannelClaimed(channelId) {
    return async (dispatch, getState, { chainProvider }) => {
        return async (dispatch, getState, { contractFactory }) => {
            const contract = contractFactory.slotsChannelManagerContract()
            try {
                const events = await contract.logClaimChannelTokens(channelId)
                if (events && events.length) {
                    let [event] = events
                    let id = event.returnValues.id.toString()
                    await dispatch(
                        Actions.setChannelClaimed(
                            id,
                            event.returnValues.isHouse
                        )
                    )
                }
                return
            } catch (error) {
                console.error('Claim channel tokens event error', error)
                return
            }
        }
    }
}
