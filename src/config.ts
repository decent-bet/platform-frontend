import {
    CURRENT_ENV,
    ENV_LOCAL,
    ENV_DEVELOPMENT,
    ENV_STAGING,
    ENV_PRODUCTION,
    IStageConfig
} from './constants'

export const STAGE_CONFIGS = {
    local: {
        wsApiUrl: 'wss://channels-api-development.decent.bet',
        thorNode: 'https://thor-staging.decent.bet'
    },
    development: {
        wsApiUrl: 'wss://channels-api-development.decent.bet',
        thorNode: 'https://thor-staging.decent.bet'
    },
    staging: {
        wsApiUrl: 'wss://channels-api-staging.decent.bet',
        thorNode: 'https://thor-staging.decent.bet'
    },
    production: {
        wsApiUrl: 'wss://channels-api-staging.decent.bet',
        thorNode: 'https://thor-staging.decent.bet'
    }
}

export function getStageConfig(): IStageConfig {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return STAGE_CONFIGS.local
        case ENV_DEVELOPMENT:
            return STAGE_CONFIGS.development
        case ENV_STAGING:
            return STAGE_CONFIGS.staging
        case ENV_PRODUCTION:
            return STAGE_CONFIGS.production
        default:
            return STAGE_CONFIGS.local
    }
}

export function getAuthApiUrl(): string {
    switch (CURRENT_ENV) {
        case ENV_LOCAL:
            return 'https://kyc-api-development.decent.bet/api'
        case ENV_DEVELOPMENT:
            return 'https://kyc-api-development.decent.bet/api'
        case ENV_STAGING:
            return 'https://kyc-staging.decent.bet/api'
        case ENV_PRODUCTION:
            return 'https://kyc-staging.decent.bet/api'
        default:
            return 'http://localhost:3200/api'
    }
}

export const AUTH_API_URL: string = getAuthApiUrl()
