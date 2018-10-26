export interface IForgotPasswordState {
    formSubmited: boolean
    email: string
    recaptchaKey: string
    error: boolean
    errorMessage: string
}

export class ForgotPasswordState implements IForgotPasswordState {
    public formSubmited = false
    public email = ''
    public recaptchaKey = ''
    public error = false
    public errorMessage = ''
}
