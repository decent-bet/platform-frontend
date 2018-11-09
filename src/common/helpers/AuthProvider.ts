import { IAuthProvider, IKeyHandler } from '../types'
import { ReplaySubject } from 'rxjs'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import * as moment from 'moment'

const ACCESS_TOKEN_LIFETIME_MS: number = 5 * 60 * 1000

export default class AuthProvider implements IAuthProvider {
    /**
     * ReplaySubject used to store the user authentication status
     * @var {ReplaySubject<any>} authUser
     */
    public authUser: ReplaySubject<any>

    /**
     * @param {IKeyHandler} keyHandler
     */
    constructor(private keyHandler: IKeyHandler) {
        this.authUser = new ReplaySubject<any>(1)
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
            console.log('on checkLogin')
            const decoded: any = jwtDecode(accessToken)

            const currentTime = moment()
                .utc()
                .valueOf()

            console.log('expire date: ', moment(decoded.exp).toDate())
            console.log('current: ', moment(currentTime).toDate())

            // the token is expired, should be make a logout
            if (currentTime > decoded.exp) {
                console.log('token expired')
                this.authUser.next(false)
            } else {
                const tokenCompareLifetime =
                    decoded.exp - ACCESS_TOKEN_LIFETIME_MS
                if (currentTime >= tokenCompareLifetime) {
                    console.log('try to refresh')
                    await this.refresh(accessToken)
                } else {
                    console.log('token is valid')
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
        this.keyHandler.clearStorage()
    }
}
