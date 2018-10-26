export default interface ISignUpProps {
    loading: boolean
    processed: boolean
    resultMessage: string
    signUp(email, password, passwordConfirmation, recaptchaKey): Promise<void>
}
