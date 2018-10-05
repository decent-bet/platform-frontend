import Actions from './actions'
import { setUserAuthenticationStatus } from '../../common/state/thunks'
const actions: any = Actions.auth 

export function makeLogin(email: string, password: string, recaptchaKey: string) {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(actions.login(email, password, recaptchaKey, keyHandler))
        await dispatch(setUserAuthenticationStatus())
    }
}