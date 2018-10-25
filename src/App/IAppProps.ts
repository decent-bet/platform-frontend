import { AlertVariant } from './../common/components/Alert'

export default interface IAppProps {
    appLoaded: boolean
    alertType: AlertVariant
    alertIsOpen: boolean
    alertMessage: string
    userIsAuthenticated: boolean
    setHttpAuthBaseUrl(): Promise<void>
    setUserAuthenticationStatus(): Promise<void>
    setAppLoaded(): Promise<void>
}
