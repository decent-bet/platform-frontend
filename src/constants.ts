export const RECAPTCHA_SITE_KEY = '6LelAVoUAAAAAO-9CWfkBOG6pHuwX-J3fERUwfaw',
    MNEMONIC_DPATH = "m/44'/818'/0'/0/0",
    CHANNEL_STATUS_WAITING = 'Waiting',
    CHANNEL_STATUS_DEPOSITED = 'Deposited',
    CHANNEL_STATUS_ACTIVATED = 'Activated',
    CHANNEL_STATUS_FINALIZED = 'Finalized',
    ENV_DEVELOPMENT: string = 'development',
    ENV_STAGING: string = 'staging',
    ENV_PRODUCTION: string = 'production',
    AUTH_TOKEN_NAME: string = 'token',
    ACCOUNT_ACTIVATED_NAME: string = 'account_activated',
    WALLET_WEBSITE_URL: string = 'http://decent.bet/wallet.php'

export const CURRENT_ENV: string = process.env.REACT_APP_ENV || ENV_DEVELOPMENT

export interface IStageConfig {
    channelsApiUrl: string
    thorNode: string
}
