
import Actions from './actions'
const actions = Actions.balance
let subscriptions = []

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

export function listenForTransfers() {
    return async (dispatch, getState, { chainProvider }) => {
        // clear any previous transfer subscriptions

        listenForTransfers_unsubscribe()

        try {
            let tokenContract = await chainProvider.contractFactory.decentBetTokenContract()
            const transferFromEvents = tokenContract.logTransfer(chainProvider.defaultAccount, true)
            const transferFromEventsSubscription = tokenContract.getEventSubscription(transferFromEvents)

            const transferToEvents = tokenContract.logTransfer(chainProvider.defaultAccount, false)
            const transferToEventsSubscription = tokenContract.getEventSubscription(transferToEvents)

            const fromSubscription = transferFromEventsSubscription.subscribe( async (events) => {
                if (events.length >= 1) {
                    await dispatch(actions.getTokens(chainProvider))
                    await dispatch(actions.getEtherBalance(chainProvider))
                }
            })
            subscriptions.push(fromSubscription)

            const toSubscription = transferToEventsSubscription.subscribe( async (events) => {
                if (events.length >= 1) {
                    await dispatch(actions.getTokens(chainProvider))
                    await dispatch(actions.getEtherBalance(chainProvider))
                }
            })

            subscriptions.push(toSubscription)

        } catch (error) {
            console.error('listenToTransfers Error:', error)
        }

        return subscriptions
    }
}

export function initialize() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(actions.getTokens(chainProvider))
        await dispatch(actions.getEtherBalance(chainProvider))
        setTimeout(async()=> {
            await dispatch(actions.getPublicAddress(chainProvider))
        })
    }     
}
export function listenForTransfers_unsubscribe() {
    subscriptions.forEach(sub => {
        sub.unsubscribe()
    })

    subscriptions = []
}

export function faucet() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(actions.faucet(chainProvider))
    }     
}