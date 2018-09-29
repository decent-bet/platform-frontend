import Actions from './actions'
const actions: any = Actions.auth 
import { userIsLoggedIn } from '../../common/state/thunks'

export function login(formData: {email: string, password: string, recaptchaKey: string}) {
    let {email, password, recaptchaKey } = formData
    return async (dispatch, _getState, { keyStore }) => {
        await dispatch(actions.login(email, password, recaptchaKey, keyStore))
        await dispatch(userIsLoggedIn())
    }
}

export function logout() {
    return async (dispatch, _getState, { keyStore }) => {
        return await dispatch(actions.logout(keyStore))
    }
}


export function closeAlert() {
    return async (dispatch) => {
        await dispatch(actions.closeAlert())
    }
}