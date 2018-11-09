import { ReplaySubject } from 'rxjs'

export default interface IAuthProvider {
    authUser: ReplaySubject<any>
    checkLogin(): Promise<void>
    refresh(accessToken: string): Promise<void>
    login(email: string, password: string, captchaKey: string): Promise<any>
    logout(): Promise<void>
}
