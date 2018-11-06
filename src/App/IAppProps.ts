import { AlertVariant } from './../common/components/Alert'
import { ReplaySubject } from 'rxjs'

export default interface IAppProps {
    appLoaded: boolean
    alertType: AlertVariant
    alertIsOpen: boolean
    alertMessage: string
    userIsAuthenticated: boolean
    setHttpAuthBaseUrl(): Promise<void>
    getAuthenticationSubject(): Promise<any>
    setAppLoaded(): Promise<void>
    checkLogin(): Promise<void>
}
