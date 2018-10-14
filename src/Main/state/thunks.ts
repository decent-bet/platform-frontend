import Actions from './actions'
const actions: any = Actions.main

export function initializeMain() {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.setHttpAuthHeader(keyHandler))
        const actionResult = await dispatch(actions.getUserAccount(keyHandler))
        const account = actionResult.value
        await dispatch(actions.setAccountIsVerified(account))
        await dispatch(actions.setAccountHasAddress(account))
        await dispatch(actions.getAccountActivationStatus(keyHandler))
    }
}
