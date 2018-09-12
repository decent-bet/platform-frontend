import Actions from './actions'
const actions = Actions.auth

export function getProviderUrl() {
    return (dispatch, getState, { chainProvider }) => {
        dispatch(actions.getProviderUrl(chainProvider))
    }
}

export function setProviderUrl(url) {
    return async (dispatch, getState, { chainProvider } ) => {
        await dispatch(actions.setProviderUrl(chainProvider, url))
    }
}

export function login(data) {
    return async (dispatch, getState, { chainProvider, keyHandler } ) => {
        await dispatch(actions.login(data, chainProvider, keyHandler))
    }
}

export function logout() {
    return async (dispatch, getState, { keyHandler } ) => {
        if(keyHandler.isLoggedIn()) {
            await dispatch(actions.logout(keyHandler))
        }
    }
}

export function userIsLoggedIn() {
    return (dispatch, getState, { keyHandler }) => {
        return keyHandler.isLoggedIn()
    }
}

export function setupChainProvider() {
    return async(dispatch, getState, { chainProvider }) => {
        await chainProvider.setupThorify()
    }
}