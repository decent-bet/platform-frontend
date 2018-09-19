
const STAGE_LOCAL = 'local'
const STAGE_TESTNET = 'testnet'
const STAGE_MAIN = 'main'

const config = {
    local: {
        channelsApiUrl: 'http://localhost:3010/api',
        kycApiUrl: '',
        thorNode: 'http://localhost:8669'
    },
    testnet: {
        channelsApiUrl: 'https://channels-api-alpha.decent.bet/api',
        kycApiUrl: '',
        thorNode: 'https://thor-staging.decent.bet'
    },
    main: {
        channelsApiUrl: 'https://channels-api.decent.bet/api',
        kycApiUrl: '',
        thorNode: 'https://thor.decent.bet'
    }
}

function getConfig(stage) {
    switch(stage) {
        case STAGE_LOCAL:
        return config.local
        case STAGE_TESTNET:
        return config.testnet
        case STAGE_MAIN:
        return config.main
        default:
        return config.local
    }
}

const stages = [{key: STAGE_MAIN, name: 'DBET Node'}, {key: STAGE_TESTNET, name: 'Infura'}, {key: STAGE_LOCAL, name: 'Local Node'}]

const defaultStage = process.env.REACT_APP_STAGE || STAGE_LOCAL

export {defaultStage, config, stages, getConfig}
