import ILoginState from './ILoginState'

export default class LoginState implements ILoginState {
    public loginDialogOpen = false
    public processing = false
    public loginValue = ''
    public hasError = false
}
