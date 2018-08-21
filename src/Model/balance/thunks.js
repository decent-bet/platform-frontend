import Actions from './actions'
const actions = Actions.balance

export function watcherChannelClaimed(channelId) {
    return async (dispatch, getState, { chainProvider }) => {
        try {
            const { contractFactory } = chainProvider
            const contract = await contractFactory.slotsChannelManagerContract()
            const subscription = contract.logClaimChannelTokens(channelId)
            const claimChannelEventSubscription = await contract.getEventSubscription(subscription)

            const claimChannelSubscription =
                claimChannelEventSubscription.subscribe(async (events) => {
                    if (events && events.length) {
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

export function listenForTransfers() {
    return async (dispatch, getState, { chainProvider }) => {
        
        try {
            let tokenContract = await chainProvider.contractFactory.decentBetTokenContract()
            const transferFromEvents = tokenContract.logTransfer(chainProvider.defaultAccount, true)
            const transferFromEventsSubscription = await tokenContract.getEventSubscription(transferFromEvents)

            const transferToEvents = tokenContract.logTransfer(chainProvider.defaultAccount, false)
            const transferToEventsSubscription = await tokenContract.getEventSubscription(transferToEvents)

            let transferFromSubscription = transferFromEventsSubscription.subscribe( async (events) => {
                console.log('transferFromEvents - Events:', events)
                if (events.length >= 1) {
                    dispatch(actions.getTokens(chainProvider))
                    transferFromSubscription.unsubscribe()
                }
            })

            let transferToSubscription = transferToEventsSubscription.subscribe( async (events) => {
                console.log('transferFromEvents - Events:', events)
                if (events.length >= 1) {
                    dispatch(actions.getTokens(chainProvider))
                    transferToSubscription.unsubscribe()
                }
            })

        } catch (error) {
            console.error('listenForTransfers Error:', error)
        }
    }
}

export function initialize() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(actions.getPublicAddress(chainProvider))
        await dispatch(actions.getTokens(chainProvider))
        await dispatch(actions.getEtherBalance(chainProvider))
        await dispatch(listenForTransfers(chainProvider))
    }     
}

export function faucet() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(actions.faucet(chainProvider))
        await dispatch(actions.getTokens(chainProvider))
        await dispatch(actions.getEtherBalance(chainProvider))
    }     
}