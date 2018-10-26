export interface IResetPasswordState {
    formSubmited: boolean
    id: string
    key: string
    password: string
    recaptchaKey: string
    error: boolean
    errorMessage: string
}

export class ResetPasswordState implements IResetPasswordState {
    public formSubmited = false
    public id = ''
    public key = ''
    public password = ''
    public recaptchaKey = ''
    public error = false
    public errorMessage = ''
}
