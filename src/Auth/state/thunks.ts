import Actions from './actions'
import { setUserAuthenticationStatus, setAccountIsActivated } from '../../common/state/thunks'
const actions: any = Actions.auth 

export function makeLogin(email: string, password: string, recaptchaKey: string) {
    return async (dispatch, _getState, { keyHandler }) => {
        const loginResult = await dispatch(actions.login(email, password, recaptchaKey, keyHandler))
        const isActivated = loginResult.value && loginResult.value.activated ? loginResult.value.activated : false
        await dispatch(setUserAuthenticationStatus())
        await dispatch(setAccountIsActivated(isActivated))
    }
}
