const MNEMONIC_DPATH = "m/44'/818'/0'/0/0"
const CHANNEL_STATUS_DEPOSITED = 'Deposited'
const CHANNEL_STATUS_ACTIVATED = 'Activated'
const CHANNEL_STATUS_FINALIZED = 'Finalized'
const ENV_LOCAL: string = 'local'
const ENV_DEVELOPMENT: string = 'development'
const ENV_STAGING: string = 'staging'
const ENV_PRODUCTION: string = 'production'
const AUTH_TOKEN_NAME: string = 'token'
const ACCOUNT_ACTIVATED_NAME: string = 'account_activated'
const ACCOUNT_TEMP_LOGIN_VALUE: string = 'acc_tmp_log'
const WALLET_WEBSITE_URL: string = 'http://decent.bet/wallet.php'
const RECAPTCHA_URL: string = 'https://www.google.com/recaptcha/api.js'

const CURRENT_ENV: string = process.env.REACT_APP_ENV || ENV_LOCAL

const symbolA = 1
const symbolB = 2
const symbolC = 3
const symbolD = 4
const symbolE = 5
const symbolF = 6
const symbolG = 7

const NUMBER_OF_LINES = 5
const NUMBER_OF_REELS = 5

const reels = [
    [7, 2, 2, 1, 5, 3, 5, 3, 2, 2, 3, 4, 2, 5, 1, 1, 6, 4, 1, 5, 3], // 0
    [1, 1, 3, 3, 5, 3, 5, 1, 2, 2, 4, 1, 3, 4, 3, 2, 2, 6, 6, 3, 7], // 1
    [4, 2, 7, 3, 2, 6, 1, 4, 3, 1, 5, 1, 1, 4, 4, 1, 5, 2, 2, 1, 1], // 2
    [1, 1, 5, 1, 2, 7, 4, 2, 1, 3, 2, 2, 3, 1, 1, 2, 6, 2, 6, 3, 5], // 3
    [1, 4, 1, 1, 2, 4, 1, 3, 6, 2, 7, 2, 4, 1, 3, 1, 3, 6, 1, 2, 5] // 4
]

const paytable = {
    [symbolA]: 10,
    [symbolB]: 20,
    [symbolC]: 30,
    [symbolD]: 50,
    [symbolE]: 75,
    [symbolF]: 150,
    [symbolG]: 300
}

export {
    MNEMONIC_DPATH,
    CHANNEL_STATUS_DEPOSITED,
    CHANNEL_STATUS_ACTIVATED,
    CHANNEL_STATUS_FINALIZED,
    ACCOUNT_TEMP_LOGIN_VALUE,
    ENV_LOCAL,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION,
    AUTH_TOKEN_NAME,
    ACCOUNT_ACTIVATED_NAME,
    WALLET_WEBSITE_URL,
    RECAPTCHA_URL,
    CURRENT_ENV,
    symbolA,
    symbolB,
    symbolC,
    symbolD,
    symbolE,
    symbolF,
    symbolG,
    NUMBER_OF_LINES,
    NUMBER_OF_REELS,
    reels,
    paytable
}
