export const MNEMONIC_DPATH = "m/44'/818'/0'/0/0"
export const CHANNEL_STATUS_DEPOSITED = 'Deposited'
export const CHANNEL_STATUS_ACTIVATED = 'Activated'
export const CHANNEL_STATUS_FINALIZED = 'Finalized'
export const ENV_LOCAL: string = 'local'
export const ENV_DEVELOPMENT: string = 'development'
export const ENV_PRODUCTION: string = 'production'
export const AUTH_TOKEN_NAME: string = 'token'
export const ACCOUNT_TEMP_LOGIN_VALUE: string = 'acc_tmp_log'
export const WALLET_WEBSITE_URL: string = 'http://decent.bet/wallet.php'
export const RECAPTCHA_URL: string = 'https://www.google.com/recaptcha/api.js'
export const MIN_VTHO_AMOUNT: number = 2000
export const APP_VERSION = process.env.REACT_APP_VERSION || ''
export const CURRENT_ENV: string = process.env.REACT_APP_ENV || ENV_LOCAL
export const CHANNEL_BACKEND_ERRORS = {
    STATUS_CODE_OK: 100,
    ERROR_CODE_DB: 101, // DB/Cache Error
    ERROR_CODE_VALIDATION: 102, // Request param validation error
    ERROR_CODE_VERIFICATION: 103,
    ERROR_CODE_REVERTED: 104, // Txs reverted
    ERROR_CODE_MIDDLEWARE: 105,
    ERROR_CODE_PROCESSING: 106,
    ERROR_CODE_USER_ALREADY_CONNECTED: 107,
    ERROR_CODE_CHANNEL_EXPIRED: 108,
    ERROR_CODE_CHANNEL_FINALIZED: 109,
    ERROR_CODE_CHANNEL_CLOSED: 110
}

export const PASSWORD_VALIDATION_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[`\~\!\@\#\$\%\^\&\*\(\)\+\_\-\=\[\{\]\}\|\\\'\<\,\.\>\?\/\""\;\:]).{6,24}$/

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
