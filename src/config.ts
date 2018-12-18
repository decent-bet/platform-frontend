import {
    CURRENT_ENV,
    ENV_LOCAL,
    ENV_DEVELOPMENT,
    ENV_PRODUCTION
} from './constants'

function getAuthApiUrl(): string {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return 'http://localhost:3200/api'
        case ENV_DEVELOPMENT:
            return 'https://kyc-api-development.decent.bet/api'
        case ENV_PRODUCTION:
            return 'https://kyc.decent.bet/api'
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
        case ENV_PRODUCTION:
            return 'wss://channels-api.decent.bet'
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
        case ENV_PRODUCTION:
            return 'https://thor.decent.bet'
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
        case ENV_PRODUCTION:
            return '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
        default:
            return '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
    }
}

function getChannelSettings() {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return {
                CHANNEL_EXPIRATION: 32,
                CHANNEL_GAS_PRICE_COEF: 0,
                CHANNEL_GAS_DEFAULT_VALUE: 500000,
                CHANNEL_NONCE: 11111111
            }
        case ENV_DEVELOPMENT:
            return {
                CHANNEL_EXPIRATION: 32,
                CHANNEL_GAS_PRICE_COEF: 0,
                CHANNEL_GAS_DEFAULT_VALUE: 500000,
                CHANNEL_NONCE: 11111111
            }
        case ENV_PRODUCTION:
            return {
                CHANNEL_EXPIRATION: 32,
                CHANNEL_GAS_PRICE_COEF: 0,
                CHANNEL_GAS_DEFAULT_VALUE: 500000,
                CHANNEL_NONCE: 11111111
            }
        default:
            return {
                CHANNEL_EXPIRATION: 32,
                CHANNEL_GAS_PRICE_COEF: 0,
                CHANNEL_GAS_DEFAULT_VALUE: 400000,
                CHANNEL_NONCE: 11111111
            }
    }
}

function getVeforgeUrl() {
    if (CURRENT_ENV === ENV_PRODUCTION) {
        return 'https://explore.veforge.com/transactions'
    } else {
        return 'https://testnet.veforge.com/transactions'
    }
}

export const CHANNEL_SETTINGS = getChannelSettings()
export const AUTH_API_URL: string = getAuthApiUrl()
export const RECAPTCHA_SITE_KEY: string = getRecaptchaKey()
export const THOR_NODE_URL: string = getThorNodeUrl()
export const WS_API_URL: string = getWsApiUrl()
export const VEFORGE_URL: string = getVeforgeUrl()
