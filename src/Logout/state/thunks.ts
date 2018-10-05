import Actions from './actions'
const actions: any = Actions.logout 
import { setUserAuthenticationStatus } from '../../common/state/thunks'

export function logout() {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.logout(keyHandler))
        await dispatch(setUserAuthenticationStatus())
    }
}
