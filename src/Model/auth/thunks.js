import Actions from './actions'
import { Thunks as BalanceThunks } from '../balance'
const actions = Actions.auth


export function getCurrentStage() {
    return (dispatch, getState, { keyHandler }) => {
         dispatch(actions.getCurrentStage(keyHandler))
    }
}

export function setCurrentStage(stage) {
    return async (dispatch, getState, { keyHandler } ) => {
        await dispatch(actions.setCurrentStage(keyHandler, stage))
    }
}

export function login(data) {
    return async (dispatch, getState, { chainProvider, keyHandler } ) => {
        await dispatch(actions.login(data, chainProvider, keyHandler))
        await dispatch(BalanceThunks.listenForTransfers())
    }
}

export function logout() {
    return async (dispatch, getState, { keyHandler } ) => {
        BalanceThunks.listenForTransfers_unsubscribe()
        await dispatch(actions.logout(keyHandler))
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