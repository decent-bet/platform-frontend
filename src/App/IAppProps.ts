import { AlertVariant } from '../common/components/Alert'
import { RouterProps } from 'react-router'
import IChannelBackendError from '../common/types/IChannelsBackendError'

export default interface IAppProps extends RouterProps {
    appLoaded: boolean
    alertType: AlertVariant
    alertIsOpen: boolean
    channelBackendError: IChannelBackendError
    channelBackendErrorIsOpen: boolean
    alertMessage: string
    userIsAuthenticated: boolean
    setHttpAuthBaseUrl(): Promise<void>
    logout(): Promise<void>
    getAuthenticationSubject(): Promise<any>
    setAppLoaded(): Promise<void>
    checkLogin(): Promise<any>
    refreshToken(): Promise<void>
    closeAlert(): Promise<void>
    hideChannelsBackendError(): Promise<void>
}
