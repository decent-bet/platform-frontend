
import Actions from './actions'
const actions: any = Actions.main
let subscriptions: any[] = []


export function initializeMain() {
    return async (dispatch, _getState, { keyHandler}) => {
        await dispatch(actions.setHttpAuthHeader(keyHandler))
        const actionResult = await dispatch(actions.getUserAccount(keyHandler))
        const profile = actionResult.value
        await dispatch(actions.setAccountIsVerified(profile))
        await dispatch(actions.setAccountHasAddress(profile))
    }
}

export function initializeBlockchain() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        await dispatch(actions.getPublicAddress(keyHandler))
        await dispatch(actions.getTokens(contractFactory, keyHandler))
        await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
    }
}

export function watcherChannelClaimed(channelId) {
    return async (dispatch, _getState, { contractFactory }) => {
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
    }
}

export function listenForTransfers() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        // clear any previous transfer subscriptions
        listenForTransfers_unsubscribe()

        let tokenContract = await contractFactory.decentBetTokenContract()
            const defaultAccount = keyHandler.getPublicAddress()
            const transferFromEventsSubscription = tokenContract.getEventSubscription(tokenContract.logTransfer(defaultAccount, true), 5000)
            const transferToEventsSubscription = tokenContract.getEventSubscription(tokenContract.logTransfer(defaultAccount, false), 5000)

            const fromSubscription = transferFromEventsSubscription.subscribe( async (events) => {
                if (events.length >= 1) {
                    await dispatch(actions.getTokens(contractFactory, keyHandler))
                    await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
                }
            })
            subscriptions.push(fromSubscription)

            const toSubscription = transferToEventsSubscription.subscribe( async (events) => {
                if (events.length >= 1) {
                    await dispatch(actions.getTokens(contractFactory, keyHandler))
                    await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
                }
            })

            subscriptions.push(toSubscription)

        return subscriptions
    }
}

export function listenForTransfers_unsubscribe() {
    subscriptions.forEach(sub => {
        sub.unsubscribe()
    })

    subscriptions = []
}

export function faucet() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        await dispatch(actions.faucet(contractFactory))
        await dispatch(actions.getTokens(contractFactory, keyHandler))
        await dispatch(actions.getEtherBalance(contractFactory, keyHandler))
    }     
}