import Actions from './actions'
const actions: any = Actions.app

export function logout() {
    return async (dispatch, _getState, { keyStore }) => {
        return await dispatch(actions.logout(keyStore))
    }
}

export function userIsLoggedIn() {
    return async (dispatch, _getState, { keyStore }) => {
        return await dispatch(actions.userIsLoggedIn(keyStore))
    }
}