export default interface IForgotPasswordProps {
    loading: boolean
    processed: boolean
    resultMessage: string
    forgotPassword(email: string, captchaKey: string): Promise<void>
}
