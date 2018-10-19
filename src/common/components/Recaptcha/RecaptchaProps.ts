export interface IRecaptchaProps {
    onloadCallback?: () => void
    verifyCallback?: (key: string) => void
    expiredCallback?: () => void
    sitekey: string
    render: string
    theme: string
    type: string
    size: string
    tabindex: string
    hl: string
    badge: string
}

export class DefaultRecaptchaProps implements IRecaptchaProps {
    public onloadCallback: undefined
    public verifyCallback: undefined
    public expiredCallback: undefined
    public sitekey = ''
    public render = ''
    public theme: 'light'
    public type: 'image'
    public size: 'normal'
    public tabindex: '0'
    public hl: 'en'
    public badge: 'bottomright'
}
