export interface IRecaptchaContainerState {
    loaded: boolean
    grecaptcha: any
}

export class RecaptchaContainerState implements IRecaptchaContainerState {
    public loaded = false
    public grecaptcha = null
}
