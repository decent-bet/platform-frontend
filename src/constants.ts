export const RECAPTCHA_SITE_KEY = '6LepTnYUAAAAAF4Jtoh2Hwk3f_AKijaT7owk6eTU'
export const MNEMONIC_DPATH = "m/44'/818'/0'/0/0"
export const CHANNEL_STATUS_DEPOSITED = 'Deposited'
export const CHANNEL_STATUS_ACTIVATED = 'Activated'
export const CHANNEL_STATUS_FINALIZED = 'Finalized'
export const ENV_LOCAL: string = 'local'
export const ENV_DEVELOPMENT: string = 'development'
export const ENV_STAGING: string = 'staging'
export const ENV_PRODUCTION: string = 'production'
export const AUTH_TOKEN_NAME: string = 'token'
export const ACCOUNT_ACTIVATED_NAME: string = 'account_activated'
export const WALLET_WEBSITE_URL: string = 'http://decent.bet/wallet.php'
export const RECAPTCHA_URL: string = 'https://www.google.com/recaptcha/api.js'

export const CURRENT_ENV: string = process.env.REACT_APP_ENV || ENV_LOCAL

export const symbolA = 1
export const symbolB = 2
export const symbolC = 3
export const symbolD = 4
export const symbolE = 5
export const symbolF = 6
export const symbolG = 7

export const NUMBER_OF_LINES = 5
export const NUMBER_OF_REELS = 5

export const reels = [
    [7, 2, 2, 1, 5, 3, 5, 3, 2, 2, 3, 4, 2, 5, 1, 1, 6, 4, 1, 5, 3], // 0
    [1, 1, 3, 3, 5, 3, 5, 1, 2, 2, 4, 1, 3, 4, 3, 2, 2, 6, 6, 3, 7], // 1
    [4, 2, 7, 3, 2, 6, 1, 4, 3, 1, 5, 1, 1, 4, 4, 1, 5, 2, 2, 1, 1], // 2
    [1, 1, 5, 1, 2, 7, 4, 2, 1, 3, 2, 2, 3, 1, 1, 2, 6, 2, 6, 3, 5], // 3
    [1, 4, 1, 1, 2, 4, 1, 3, 6, 2, 7, 2, 4, 1, 3, 1, 3, 6, 1, 2, 5] // 4
]

export const paytable = {
    [symbolA]: 10,
    [symbolB]: 20,
    [symbolC]: 30,
    [symbolD]: 50,
    [symbolE]: 75,
    [symbolF]: 150,
    [symbolG]: 300
}
