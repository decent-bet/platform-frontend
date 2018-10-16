import Actions from './actions'
const actions: any = Actions.logout
import { setUserAuthenticationStatus } from '../../common/state/thunks'
import { IThunkDependencies } from '../../common/types'

export function logout() {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.logout(keyHandler))
        await dispatch(setUserAuthenticationStatus())
    }
}
