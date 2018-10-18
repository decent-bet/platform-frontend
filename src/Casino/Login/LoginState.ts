export interface ILoginState {
    open: boolean
    processing: boolean
    loginValue: string
    hasError: boolean
}

export class LoginState implements ILoginState {
    public open = true
    public processing = false
    public loginValue = ''
    public hasError = false
}
