import { Observable, ReplaySubject } from 'rxjs'

export default interface IAuthProvider {
    authUser: ReplaySubject<any>
    checkLogin(): void
    login(email: string, password: string, captchaKey: string): Observable<any>
    logout(): Promise<void>
}
