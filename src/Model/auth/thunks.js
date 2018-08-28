import Actions from './actions'
const actions = Actions.auth

export function getProviderUrl() {
    return (dispatch, getState, { chainProvider }) => {
        dispatch(actions.getProviderUrl(chainProvider))
    }
}

export function setProviderUrl(url) {
    return (dispatch, getState, { chainProvider } ) => {
        dispatch(actions.setProviderUrl(chainProvider, url))
    }
}