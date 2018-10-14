import {
    CURRENT_ENV,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION,
    STAGE_LOCAL,
    STAGE_TESTNET,
    STAGE_MAIN,
    CURRENT_STAGE,
    IStageConfig
} from './constants'

export const STAGE_CONFIGS = {
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

export function getStageConfig(): IStageConfig {
    switch (CURRENT_STAGE) {
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

export function getAuthApiUrl(env): string {
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

export const AUTH_API_URL: string = getAuthApiUrl(CURRENT_ENV)
