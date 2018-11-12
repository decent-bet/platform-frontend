import { ReplaySubject } from 'rxjs'

export default interface IAuthProvider {
    /**
     * ReplaySubject used to store the user authentication status
     * A variant of Subject that "replays" or emits old values to new subscribers.
     * It buffers a set number of values and will emit those values immediately to any new subscribers in addition to emitting new values to existing subscribers.
     * {@link https://rxjs-dev.firebaseapp.com/api/index/class/ReplaySubject ReplaySubject}
     * @var {ReplaySubject<boolean>} authUser
     */
    authUser: ReplaySubject<boolean>
    checkLogin(): Promise<void>
    refresh(accessToken: string): Promise<void>
    login(email: string, password: string, captchaKey: string): Promise<any>
    logout(): Promise<void>
}
