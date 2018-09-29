const STAGE_LOCAL = 'local'
const STAGE_TESTNET = 'testnet'
const STAGE_MAIN = 'main'

interface IStage {key: string, name: string}

const STAGES: IStage[] = [
    { key: STAGE_MAIN, name: 'DBET Node' },
    { key: STAGE_TESTNET, name: 'Infura' },
    { key: STAGE_LOCAL, name: 'Local Node' }
]

interface IStageConfig {channelsApiUrl: string, thorNode: string}

const DEFAULT_STAGE: string = process.env.REACT_APP_STAGE || STAGE_LOCAL

const STAGE_CONFIGS = {
    local: {
        channelsApiUrl: 'http://localhost:3010/api',
        thorNode: 'http://localhost:8669'
    },
    testnet: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        thorNode: 'https://thor-staging.decent.bet'
    },
    main: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        thorNode: 'https://thor-staging.decent.bet'
    }
}

function getStageConfig(stage): IStageConfig {
    switch (stage) {
        case STAGE_LOCAL:
            return STAGE_CONFIGS.local
        case STAGE_TESTNET:
            return STAGE_CONFIGS.testnet
        case STAGE_MAIN:
            return STAGE_CONFIGS.main
        default:
            return STAGE_CONFIGS.local
    }
}

const ENV_DEVELOPMENT: string = 'development'
const ENV_STAGING: string = 'staging'
const ENV_PRODUCTION: string = 'production'
const AUTH_TOKEN_NAME: string = 'token'

function getAuthUrl(env): string {
    switch (env) {
        case ENV_DEVELOPMENT:
            return 'http://localhost:3200/api'
        case ENV_STAGING:
            return 'https://kyc-staging.decent.bet/api'
        case ENV_PRODUCTION:
            return 'https://kyc-staging.decent.bet/api'
        default:
            return 'http://localhost:3200/api'
    }
}

const CURRENT_ENV: string = process.env.REACT_APP_ENV || ENV_DEVELOPMENT
const AUTH_URL: string = getAuthUrl(CURRENT_ENV)

export {
    IStageConfig,
    IStage,
    AUTH_URL,
    CURRENT_ENV,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION,
    STAGES,
    getStageConfig,
    DEFAULT_STAGE,
    STAGE_LOCAL,
    STAGE_TESTNET,
    STAGE_MAIN,
    AUTH_TOKEN_NAME
}
