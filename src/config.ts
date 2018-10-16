import {
    CURRENT_ENV,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION,
    IStageConfig
} from './constants'

export const STAGE_CONFIGS = {
    local: {
        channelsApiUrl: 'http://localhost:3010/api',
        wsApiUrl: 'ws://localhost:3010',
        thorNode: 'http://localhost:8669'
    },
    testnet: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        wsApiUrl: 'ws://localhost:3010',
        thorNode: 'https://thor-staging.decent.bet'
    },
    main: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        wsApiUrl: '',
        thorNode: 'https://thor-staging.decent.bet'
    }
}

export function getStageConfig(): IStageConfig {
    switch (CURRENT_ENV) {
        case ENV_DEVELOPMENT:
            return STAGE_CONFIGS.local
        case ENV_STAGING:
            return STAGE_CONFIGS.testnet
        case ENV_PRODUCTION:
            return STAGE_CONFIGS.main
        default:
            return STAGE_CONFIGS.local
    }
}

export function getAuthApiUrl(): string {
    switch (CURRENT_ENV) {
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

export const AUTH_API_URL: string = getAuthApiUrl()
