import Actions from './actions'
const actions: any = Actions.auth 

export function login(email, password, capchakey) {
    return async (dispatch, _getState, { keyStore }) => {
        return await dispatch(actions.login(email, password, capchakey, keyStore))
    }
}

export function logout() {
    return async (dispatch, _getState, { keyStore }) => {
        return await dispatch(actions.logout(keyStore))
    }
}