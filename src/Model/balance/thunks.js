import Actions from './actions'
const actions = Actions.balance

export function listenForTransfers() {
    return async (dispatch, getState, { chainProvider }) => {
        let tokenContract = await chainProvider.contractFactory.decentBetTokenContract()
        // Transfer from
        tokenContract
            .logTransfer(chainProvider.defaultAccount, true)
            .then((error, events) => {
                dispatch(actions.getTokens(chainProvider))
            })
        //Transfer To
        tokenContract
            .logTransfer(chainProvider.defaultAccount, false)
            .then((error, events) => {
                dispatch(actions.getTokens(chainProvider))
            })
    }
        
}

export function initialize() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(actions.getPublicAddress(chainProvider))
        await dispatch(actions.getTokens(chainProvider))
        await dispatch(actions.getEtherBalance(chainProvider))
        //await dispatch(listenForTransfers(chainProvider))
    }     
}

export function faucet() {
    return async (dispatch, getState, { chainProvider }) => {
        await dispatch(actions.faucet(chainProvider))
        await dispatch(actions.getTokens(chainProvider))
    }     
}