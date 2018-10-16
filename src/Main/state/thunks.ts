import Actions from './actions'
const actions: any = Actions.main
import { IThunkDependencies } from '../../common/types'

export function initializeMain() {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.setHttpAuthHeader(keyHandler))
        const actionResult = await dispatch(actions.getUserAccount())
        const account = actionResult.value
        await dispatch(actions.setAccountIsVerified(account))
        await dispatch(actions.setAccountHasAddress(account))
        await dispatch(actions.getAccountActivationStatus(keyHandler))
    }
}

export function setAccountIsVerified() {
    return async dispatch => {
        const actionResult = await dispatch(actions.getUserAccount())
        const account = actionResult.value
        await dispatch(actions.setAccountIsVerified(account))
    }
}

export function setAccountHasAddress() {
    return async dispatch => {
        const actionResult = await dispatch(actions.getUserAccount())
        const account = actionResult.value
        await dispatch(actions.setAccountHasAddress(account))
    }
}
