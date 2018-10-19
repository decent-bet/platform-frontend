export interface IRecaptchaState {
    widget: any
    grecaptcha: any
}

export class RecaptchaState implements IRecaptchaState {
    public widget = null
    public grecaptcha = null
}
