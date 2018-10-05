import Actions from './actions'
const actions: any = Actions.profile 

export function saveUserProfile() {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.saveUserProfile(keyHandler))
    }
}
