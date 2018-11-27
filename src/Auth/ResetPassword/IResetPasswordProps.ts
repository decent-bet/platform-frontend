import { match } from 'react-router-dom'

export default interface IResetPasswordProps {
    match: match<{ id: string; key: string }>
    processed: boolean
    verified: boolean
    resultMessage: string
    loading: boolean
    resetPasswordVerify(id: string, key: string): Promise<void>
    resetPassword(
        id: string,
        key: string,
        password: string,
        _captchaKey: string
    ): Promise<void>
}
