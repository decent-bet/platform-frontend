import ILoginState from './ILoginState'

export default class LoginState implements ILoginState {
    public open = true
    public processing = false
    public loginValue = ''
    public hasError = false
}
