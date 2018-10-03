import Actions from './actions'
import { userIsLoggedIn } from '../../common/state/thunks'
const actions: any = Actions.auth 

export function login(formData: {email: string, password: string, recaptchaKey: string}) {
    let {email, password, recaptchaKey } = formData
    return async (dispatch, _getState, { keyStore }) => {
        await dispatch(actions.login(email, password, recaptchaKey, keyStore))
        await dispatch(userIsLoggedIn())
    }
}