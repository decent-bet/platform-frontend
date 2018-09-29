import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import mainReducer from './common/state'
import balanceReducer from './Dashboard/state'
import authReducer from './Auth/state'
import slotsManagerReducer from './Slots/state'

import ThorifyFactory from './common/helpers/ThorifyFactory'
import KeyStore from './common/helpers/KeyStore'
import KeyHandler from './common/helpers/KeyHandler'
import { CURRENT_ENV, ENV_DEVELOPMENT} from './config'

// Combine all Reducers
const CombinedReducers = combineReducers({
    main: mainReducer,
    slotsManager: slotsManagerReducer,
    balance: balanceReducer,
    auth: authReducer
})

const keyStore = new KeyStore()
const keyHandler = new KeyHandler(keyStore)
const thorifyFactory = new ThorifyFactory(keyHandler)

// Setup middlewares
const middlewares = [
    ReduxThunk.withExtraArgument({ keyStore, thorifyFactory, keyHandler }), // inject dependencies
    promiseMiddleware({ promiseTypeDelimiter: '/' })
]
// Only log redux on development
if (CURRENT_ENV === ENV_DEVELOPMENT) {
    middlewares.push(logger)
}

export default createStore(CombinedReducers, {}, applyMiddleware(...middlewares))
