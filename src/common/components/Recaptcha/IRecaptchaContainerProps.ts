export default interface IRecaptchaContainerProps {
    onKeyChange(key: string): void
    onSetRef(grecaptcha: any): void
}
