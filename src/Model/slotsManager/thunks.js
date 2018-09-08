import Actions from './actions'
import { Actions as BalanceActions } from '../balance'
import SlotsChannelHandler from './SlotsChannelHandler'

let slotsChannelHandler = null

export function initializeSlots() {

    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(Actions.getBalance(chainProvider))
        await dispatch(Actions.getAllowance(chainProvider))
    }
}

export function spin(totalBetSize, props, listener) {
    return async (dispatch, getState, { chainProvider }) => {
        
        if(!slotsChannelHandler) {
            slotsChannelHandler = new SlotsChannelHandler(chainProvider.web3)
        }

        await slotsChannelHandler.spin(totalBetSize, props, chainProvider, listener)
    }
}

export function fetchChannels() {
    return async (dispatch, getState, { chainProvider } ) => {
        return await dispatch(Actions.getChannels(chainProvider))
    }
}

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise}
 */
export function claimAndWithdrawFromChannel(channelId) {
    return async (dispatch, getState, { chainProvider } ) => {
        // Claim the channel, check token total in the contract, and withdraw tokens
        await dispatch(Actions.claimChannel(channelId, chainProvider))
        const tokensInContract = await dispatch(
            Actions.getBalance(chainProvider, channelId)
        )

        if(tokensInContract)
            await dispatch(Actions.withdrawChips(tokensInContract.value))   

        // Update the ether balance
        await dispatch(BalanceActions.getEtherBalance(chainProvider))
    }
}

/**
 * Builds a State Channel in a single step
 * @param {BigNumber} amount
 * @param {BigNumber} allowance
 * @param balanceZ
 * @returns {Promise<string>}
 */
export function buildChannel(amount, allowance, balance) {
    return async (dispatch, getState, { chainProvider }) => {
        // Approve Tokens if it needs more allowance
        if(balance.isLessThan(amount)) {
            let depositAmount = (balance.isGreaterThan(0)) ?
                amount.minus(balance) :
                amount

            if (allowance.isLessThan(depositAmount)) {
                await dispatch(Actions.approve(depositAmount, chainProvider))
            }

            await dispatch(Actions.depositChips(depositAmount, chainProvider))
        }

        // Create Channel
        const channelTransaction = await dispatch(
            Actions.createChannel(amount, chainProvider)
        )
        if (channelTransaction && channelTransaction.value) {

            const createdChannelIdResult = await dispatch(Actions.waitForChannelCreation(channelTransaction.value, chainProvider))
            const channelId = createdChannelIdResult.value
            // Deposit Tokens to channel
            await dispatch(Actions.depositToChannel(channelId, chainProvider))

            // Query the channel's data and add it to the redux state
            
            setTimeout(async () => {
                await dispatch(Actions.getChannel(channelId, chainProvider))
            }, 10000)
            
            // Update the ether balance
            await dispatch(BalanceActions.getEtherBalance(chainProvider))
            return channelId
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

export function finalizeChannel(channelId, state) {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(Actions.finalizeChannel(channelId, state, chainProvider))
    }
}

// Watcher that monitors channel finalization
export function watcherChannelFinalized(channelId) {
    return async (dispatch, getState, { chainProvider }) => {
        
        try {
            let { contractFactory } = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()
            const finalizedChannelEventSubscription =
                await contract.getEventSubscription(contract.logChannelFinalized(channelId))

            const finalizedChannelSubscription =
                finalizedChannelEventSubscription.subscribe(async (events) => {
                    if (events && events.length) {
                        let [event] = events
                        let id = event.returnValues.id.toString()
                        await dispatch(Actions.setChannelFinalized(id))
                        finalizedChannelSubscription.unsubscribe()
                    }
                })
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
            try {
                const { contractFactory } = chainProvider
                const contract = await contractFactory.slotsChannelManagerContract()
                const subscription = contract.logClaimChannelTokens(channelId)
                const claimChannelEventSubscription = contract.getEventSubscription(subscription)

                const claimChannelSubscription =
                    claimChannelEventSubscription.subscribe(async (events) => {
                        if (events && events.length >=1) {
                            let [event] = events
                            let id = event.returnValues.id.toString()
                            await
                                dispatch(
                                    Actions.setChannelClaimed(
                                        id,
                                        event.returnValues.isHouse
                                    )
                                )
                            claimChannelSubscription.unsubscribe()
                        }
                    })
                return
            } catch (error) {
                console.error('Claim channel tokens event error', error)
                return
            }
        }
}
