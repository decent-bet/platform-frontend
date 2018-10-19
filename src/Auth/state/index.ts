import { combineReducers } from 'redux'
import forgotPassword from '../ForgotPassword/state'
import login from '../Login/state'
import resetPassword from '../ResetPassword/state'
import signUp from '../SignUp/state'

export default combineReducers({
    forgotPassword,
    login,
    resetPassword,
    signUp
})
