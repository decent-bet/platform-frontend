import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import balanceReducer from '../dashboard/reducer'
import authReducer from '../auth/reducer'
import slotsManagerReducer from '../slots/reducer'

import ThorifyFactory from '../shared/helpers/ThorifyFactory'
import KeyStore from '../shared/helpers/KeyStore'
import KeyHandler from '../shared/helpers/KeyHandler'
import { CURRENT_ENV, ENV_DEVELOPMENT} from './config'

// Combine all Reducers
const CombinedReducers = combineReducers({
    slotsManager: slotsManagerReducer,
    balance: balanceReducer,
    auth: authReducer
})

const keyStore = new KeyStore()
const keyHandler = new KeyHandler(keyStore) // setup the key store and the key handler
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
