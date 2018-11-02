import { switchMap } from 'rxjs/operators'
import { ReplaySubject, Observable, of, defer } from 'rxjs'
import axios from 'axios'
import { IKeyHandler } from '../types'
import jwtDecode from 'jwt-decode'
// import * as moment from 'moment'

export class AuthProvider {
    public authUser = new ReplaySubject<any>(1)

    constructor(private readonly keyHandler: IKeyHandler) {}

    public checkLogin() {
        this.keyHandler.getAuthToken().then(jwt => {
            if (!jwt) {
                this.logout()
            } else {
                const decoded: any = jwtDecode(jwt)
                const currentTime = Date.now() / 1000
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
            if (response) {
                const { accessToken } = response.data
                await this.keyHandler.setAuthToken(accessToken)
                this.handleJwtResponse(accessToken)
            }

            return {
                error: false,
                activated: response.data.activated,
                message: response.data.message || 'Successfully logged in'
            }
        }).pipe(switchMap(i => of(i)))
    }

    private async handleJwtResponse(jwt: string) {
        console.log('jwt', jwt)
        await this.keyHandler.setAuthToken(jwt)
        this.authUser.next(jwt)
        return jwt
    }

    public logout() {
        this.keyHandler.clearStorage().then(() => this.authUser.next(null))
    }
}
