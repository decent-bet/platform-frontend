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

const DEFAULT_STAGE: string =  process.env.REACT_APP_STAGE || STAGE_LOCAL

const STAGE_CONFIGS = {
    local: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        wsApiUrl: 'ws://localhost:3010',
        thorNode: 'https://thor-staging.decent.bet'
    },
    testnet: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        wsApiUrl: '',
        thorNode: 'https://thor-staging.decent.bet'
    },
    main: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        wsApiUrl: 'ws://localhost:3010',
        thorNode: 'https://thor-staging.decent.bet'
    }
}

function getStageConfig(stage: string): IStageConfig {
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

const ENV_DEVELOPMENT = 'development'
const ENV_STAGING = 'staging'
const ENV_PRODUCTION = 'production'
const CURRENT_ENV = process.env.NODE_ENV || ENV_DEVELOPMENT
console.log('Current env', CURRENT_ENV)

function getAuthUrl(): string {
    switch (CURRENT_ENV) {
        case ENV_DEVELOPMENT:
            return 'http://localhost:3200'
        case ENV_STAGING:
            return 'https://kyc-staging.decent.bet'
        case ENV_PRODUCTION:
            return 'https://kyc-staging.decent.bet'
        default:
            return 'http://localhost:3200'
    }
}

export {
    IStage,
    IStageConfig,
    getAuthUrl,
    CURRENT_ENV,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION,
    STAGES,
    getStageConfig,
    DEFAULT_STAGE,
    STAGE_LOCAL,
    STAGE_TESTNET,
    STAGE_MAIN
}
