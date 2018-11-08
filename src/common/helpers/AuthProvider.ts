import { IAuthProvider, IKeyHandler } from '../types'
import { ReplaySubject } from 'rxjs'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import * as moment from 'moment'

export default class AuthProvider implements IAuthProvider {
    public authUser: ReplaySubject<any>
    private keyHandler: IKeyHandler

    constructor(keyHandler: IKeyHandler) {
        this.keyHandler = keyHandler
        this.authUser = new ReplaySubject<any>(1)
    }

    public async checkLogin(): Promise<void> {
        this.keyHandler.getAuthToken().then(async jwt => {
            if (!jwt) {
                this.authUser.next(null)
            } else {
                const decoded: any = jwtDecode(jwt)
                const currentTime =
                    moment()
                        .utc()
                        .unix() / 1000
                if (decoded.exp < currentTime) {
                    await this.logout()
                } else {
                    this.authUser.next(jwt)
                }
            }
        })
    }

    public async login(
        email: string,
        password: string,
        captchaKey: string
    ): Promise<any> {
        const data = { email, password, captchaKey }
        const response = await axios.post('/login', data)
        const { accessToken, refreshToken, activated, message } = response.data

        await this.keyHandler.setAuthToken(accessToken, refreshToken)
        this.authUser.next(accessToken)

        return {
            error: false,
            activated,
            message
        }
    }

    public async logout(): Promise<void> {
        await this.keyHandler.clearStorage()
        this.authUser.next(null)
    }
}
