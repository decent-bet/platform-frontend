import actions from './actions'
import { IThunkDependencies } from '../../common/types'
const _actions: any = actions.auth

export function makeLogin(
    email: string,
    password: string,
    recaptchaKey: string
) {
    return async (
        dispatch,
        _getState,
        { authProvider }: IThunkDependencies
    ) => {
        await dispatch(
            _actions.login(email, password, recaptchaKey, authProvider)
        )
    }
}
