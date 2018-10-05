import Actions from './actions'
import IKeyHandler from '../../common/helpers/IKeyHandler'
const actions: any = Actions.app

export function logout() {
    return async (dispatch, _getState, { keyHandler }: {keyHandler: IKeyHandler}) => {
        return await dispatch(actions.logout(keyHandler))
    }
}

export function setUserAuthenticationStatus() {
    return async (dispatch, _getState, { keyHandler }: {keyHandler: IKeyHandler}) => {
        return await dispatch(actions.setUserAuthenticationStatus(keyHandler))
    }
}

export function setHttpAuthHeader() {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.setHttpAuthHeader(keyHandler))
    }
}

export function setHttpAuthBaseUrl() {
    return async (dispatch) => {
        await dispatch(actions.setHttpAuthBaseUrl())
    }
}


