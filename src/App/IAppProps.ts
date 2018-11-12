import { AlertVariant } from '../common/components/Alert'
import { RouterProps } from 'react-router'

export default interface IAppProps extends RouterProps {
    appLoaded: boolean
    alertType: AlertVariant
    alertIsOpen: boolean
    alertMessage: string
    userIsAuthenticated: boolean
    setHttpAuthBaseUrl(): Promise<void>
    logout(): Promise<void>
    getAuthenticationSubject(): Promise<any>
    setAppLoaded(): Promise<void>
    checkLogin(): Promise<any>
    refreshToken(): Promise<void>
    closeAlert(): Promise<void>
}
