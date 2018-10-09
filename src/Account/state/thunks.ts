import Actions from './actions'
const actions: any = Actions.account 

export function saveAccountInfo(formData: any) {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.saveAccountInfo(keyHandler, formData))
    }
}

export function saveAccountAddress(publicAddress, privateKey) {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.saveAccountInfo(keyHandler, publicAddress, privateKey))
    }
}
