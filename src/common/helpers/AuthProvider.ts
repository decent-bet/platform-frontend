import { IAuthProvider, IKeyHandler } from '../types'
import { switchMap } from 'rxjs/operators'
import { ReplaySubject, Observable, of, defer } from 'rxjs'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import * as moment from 'moment'

export default class AuthProvider implements IAuthProvider {
    public authUser: ReplaySubject<any> = new ReplaySubject<any>(1)

    constructor(private readonly keyHandler: IKeyHandler) {}

    public checkLogin(): void {
        this.keyHandler.getAuthToken().then(jwt => {
            if (!jwt) {
                this.logout()
            } else {
                const decoded: any = jwtDecode(jwt)
                const currentTime =
                    moment()
                        .utc()
                        .unix() / 1000
                if (decoded.exp < currentTime) {
                    this.logout()
                } else {
                    this.authUser.next(jwt)
                }
            }
        })
    }

    public login(
        email: string,
        password: string,
        captchaKey: string
    ): Observable<any> {
        const data = { email, password, captchaKey }

        return defer(async () => {
            const response = await axios.post('/login', data)

            const { accessToken } = response.data
            await this.keyHandler.setAuthToken(accessToken)
            await this.keyHandler.setAuthToken(accessToken)
            this.authUser.next(accessToken)

            return {
                error: false,
                activated: response.data.activated,
                message: response.data.message || 'Successfully logged in'
            }
        }).pipe(switchMap(i => of(i)))
    }

    public async logout(): Promise<void> {
        await this.keyHandler.clearStorage()
        this.authUser.next(null)
    }
}
