import Actions from './actions'
const actions: any = Actions.logout 
import { userIsLoggedIn } from '../../common/state/thunks'


export function logout() {
    return async (dispatch, _getState, { keyStore }) => {
        await dispatch(actions.logout(keyStore))
        await dispatch(userIsLoggedIn())
    }
}
