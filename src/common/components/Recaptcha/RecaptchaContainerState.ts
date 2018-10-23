export interface IRecaptchaContainerState {
    loaded: boolean
    recatpchaRef: any
}

export class RecaptchaContainerState implements IRecaptchaContainerState {
    public loaded = false
    public recatpchaRef = null
}
