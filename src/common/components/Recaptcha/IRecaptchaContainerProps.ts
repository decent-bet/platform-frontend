export default interface IRecaptchaProps {
    onKeyChange(key: string): void
    onSetRef(grecaptcha: any): void
}
