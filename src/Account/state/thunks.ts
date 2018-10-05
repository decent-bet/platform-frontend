import Actions from './actions'
const actions: any = Actions.account 

export function saveAccountInfo() {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.saveAccountInfo(keyHandler))
    }
}
