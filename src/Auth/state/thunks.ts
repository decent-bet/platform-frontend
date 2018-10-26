import actions from './actions'
import { setUserAuthenticationStatus } from '../../common/state/thunks'
const _actions: any = actions.auth

export function makeLogin(
    email: string,
    password: string,
    recaptchaKey: string
) {
    return async (dispatch, _getState, { keyHandler }) => {
        await dispatch(
            _actions.login(email, password, recaptchaKey, keyHandler)
        )
        await dispatch(setUserAuthenticationStatus())
    }
}
