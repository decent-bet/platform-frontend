import { IAuthProvider, IKeyHandler } from '../types'
import { ReplaySubject } from 'rxjs'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import * as moment from 'moment'

const ACCESS_TOKEN_LIFETIME_MS: number = 5 * 60 * 1000

export default class AuthProvider implements IAuthProvider {
    /**
     * ReplaySubject used to store the user authentication status
     * A variant of Subject that "replays" or emits old values to new subscribers.
     * It buffers a set number of values and will emit those values immediately to any new subscribers in addition to emitting new values to existing subscribers.
     * {@link https://rxjs-dev.firebaseapp.com/api/index/class/ReplaySubject ReplaySubject}
     * @var {ReplaySubject<boolean>} authUser
     */
    public authUser: ReplaySubject<boolean>

    /**
     * @param {IKeyHandler} keyHandler
     */
    constructor(private keyHandler: IKeyHandler) {
        this.authUser = new ReplaySubject<boolean>(1)
    }

    /**
     * Check the authentication status of the user and update the ReplaySubject with the result
     * @return {Promise<void>}
     */
    public async checkLogin(): Promise<void> {
        try {
            const accessToken = await this.keyHandler.getAuthToken()
            if (!accessToken) {
                this.authUser.next(false)
                return
            }
            const decoded: any = jwtDecode(accessToken)

            const currentTime = moment()
                .utc()
                .valueOf()

            // the token is expired, we should make a logout
            if (currentTime > decoded.exp) {
                this.authUser.next(false)
            } else {
                const tokenCompareLifetime =
                    decoded.exp - ACCESS_TOKEN_LIFETIME_MS
                if (currentTime >= tokenCompareLifetime) {
                    await this.refresh(accessToken)
                } else {
                    this.authUser.next(true)
                }
            }
        } catch (error) {
            console.error(error)
            this.authUser.next(false)
        }
    }

    /**
     * try to get a new access token for the user using the refresh token and the access token if it's no expired
     * @param {string} accessToken
     * @return {Promise<void>}
     */
    public async refresh(accessToken: string): Promise<void> {
        try {
            const refreshToken = await this.keyHandler.getRefreshToken()
            const decoded: any = jwtDecode(refreshToken)
            if (
                moment()
                    .utc()
                    .valueOf() > decoded.exp
            ) {
                this.authUser.next(false)
            } else {
                const data = { accessToken, refreshToken }
                const response = await axios.post('/accessToken', data)

                await this.keyHandler.setAuthToken(
                    response.data.accessToken,
                    refreshToken
                )
                this.authUser.next(true)
            }
        } catch (error) {
            console.error(error)
            this.authUser.next(false)
        }
    }

    /**
     * Performs a login request for the current user
     * @param {string} email
     * @param {string} password
     * @param {string} captchaKey
     *
     * @returns {Promise<any>}
     */
    public async login(
        email: string,
        password: string,
        captchaKey: string
    ): Promise<any> {
        const data = { email, password, captchaKey }
        const response = await axios.post('/login', data)
        const { accessToken, refreshToken, activated, message } = response.data

        await this.keyHandler.setAuthToken(accessToken, refreshToken)
        this.authUser.next(true)

        return {
            error: false,
            activated,
            message
        }
    }

    /**
     * Performs a logout and clear all session data for the current user
     * @returns {Promise<void>}
     */
    public async logout(): Promise<void> {
        await this.keyHandler.clearStorage()
    }
}
