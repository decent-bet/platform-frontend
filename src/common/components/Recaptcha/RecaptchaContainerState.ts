export interface IRecaptchaState {
    loaded: boolean
    grecaptcha: any
}

export class RecaptchaState implements IRecaptchaState {
    public loaded = false
    public grecaptcha = null
}
