import {
    CURRENT_ENV,
    ENV_LOCAL,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION
} from './constants'

function getAuthApiUrl(): string {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return 'http://localhost:3200/api'
        case ENV_DEVELOPMENT:
            return 'https://kyc-api-development.decent.bet/api'
        case ENV_STAGING:
            return 'https://kyc-staging.decent.bet/api'
        case ENV_PRODUCTION:
            return 'https://kyc-staging.decent.bet/api'
        default:
            return 'http://localhost:3200/api'
    }
}

function getWsApiUrl() {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return 'ws://localhost:3010'
        case ENV_DEVELOPMENT:
            return 'wss://channels-api-development.decent.bet'
        case ENV_STAGING:
            return 'wss://channels-api-staging.decent.bet'
        case ENV_PRODUCTION:
            return 'wss://channels-api-staging.decent.bet'
        default:
            return 'ws://localhost:3010'
    }
}

function getThorNodeUrl() {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return 'https://thor-staging.decent.bet' // 'http://localhost:8669'
        case ENV_DEVELOPMENT:
            return 'https://thor-staging.decent.bet'
        case ENV_STAGING:
            return 'https://thor-staging.decent.bet'
        case ENV_PRODUCTION:
            return 'https://thor-staging.decent.bet'
        default:
            return 'https://thor-staging.decent.bet'
    }
}

function getRecaptchaKey() {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return '6LfAVnYUAAAAAO9j5Y5T_4qzRwx1R6DOLUXru0s4'
        case ENV_DEVELOPMENT:
            return '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
        case ENV_STAGING:
            return '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
        case ENV_PRODUCTION:
            return '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
        default:
            return '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
    }
}

export const AUTH_API_URL: string = getAuthApiUrl()
export const RECAPTCHA_SITE_KEY: string = getRecaptchaKey()
export const THOR_NODE_URL: string = getThorNodeUrl()
export const WS_API_URL: string = getWsApiUrl()
