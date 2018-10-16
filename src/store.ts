import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import appReducer from './common/state'
import mainReducer from './Main/state'
import authReducer from './Auth/state'
import accountReducer from './Account/state'
import casinoReducer from './Casino/state'
import ContractFactory from './common/ContractFactory'
import ThorifyFactory from './common/helpers/ThorifyFactory'
import KeyStore from './common/helpers/KeyStore'
import KeyHandler from './common/helpers/KeyHandler'
import { RejectionCatcherMiddleware } from './common/helpers/RejectionCatcherMiddleware'
import { CURRENT_ENV, ENV_DEVELOPMENT } from './constants'
import Utils from './common/helpers/Utils'
import DecentWSAPI from './common/apis/DecentWSAPI'
import SlotsChannelHandler from './common/apis/SlotsChannelHandler'
// Combine all Reducers
const CombinedReducers = combineReducers({
    app: appReducer,
    main: mainReducer,
    auth: authReducer,
    account: accountReducer,
    casino: casinoReducer
})

const keyHandler = new KeyHandler(new KeyStore())
const thorifyFactory = new ThorifyFactory(keyHandler)
const contractFactory = new ContractFactory(thorifyFactory, keyHandler)
const utils = new Utils(keyHandler, thorifyFactory)
const wsApi = new DecentWSAPI(keyHandler, utils)
const slotsChannelHandler = new SlotsChannelHandler(wsApi, utils)
// Setup middlewares
const middlewares = [
    ReduxThunk.withExtraArgument({
        contractFactory,
        keyHandler,
        thorifyFactory,
        utils,
        wsApi,
        slotsChannelHandler
    }), // inject dependencies
    promiseMiddleware({ promiseTypeDelimiter: '/' }),
    RejectionCatcherMiddleware
]

// Only log redux on development
if (CURRENT_ENV === ENV_DEVELOPMENT) {
    middlewares.push(logger)
}

export default createStore(
    CombinedReducers,
    {},
    applyMiddleware(...middlewares)
)
