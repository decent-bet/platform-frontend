export const RECAPTCHA_SITE_KEY = '6LelAVoUAAAAAO-9CWfkBOG6pHuwX-J3fERUwfaw',
    MNEMONIC_DPATH = "m/44'/818'/0'/0/0",
    CHANNEL_STATUS_WAITING = 'Waiting',
    CHANNEL_STATUS_DEPOSITED = 'Deposited',
    CHANNEL_STATUS_ACTIVATED = 'Activated',
    CHANNEL_STATUS_FINALIZED = 'Finalized',
    // STAGES
    STAGE_LOCAL = 'local',
    STAGE_TESTNET = 'testnet',
    STAGE_MAIN = 'main',
    ENV_DEVELOPMENT: string = 'development',
    ENV_STAGING: string = 'staging',
    ENV_PRODUCTION: string = 'production',
    AUTH_TOKEN_NAME: string = 'token',
    ACCOUNT_ACTIVATED_NAME: string = 'account_activated'

export const CURRENT_STAGE: string = process.env.REACT_APP_STAGE || STAGE_LOCAL
export const CURRENT_ENV: string = process.env.REACT_APP_ENV || ENV_DEVELOPMENT

export interface IStageItem {
    key: string
    name: string
}

export const STAGES: IStageItem[] = [
    { key: STAGE_MAIN, name: 'DBET Node' },
    { key: STAGE_TESTNET, name: 'Infura' },
    { key: STAGE_LOCAL, name: 'Local Node' }
]

export interface IStageConfig {
    channelsApiUrl: string
    thorNode: string
}

export type StageType = 'main' | 'testnet' | 'local'
