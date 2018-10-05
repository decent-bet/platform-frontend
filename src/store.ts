import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import appReducer from './common/state'
import mainReducer from './Main/state'
import authReducer from './Auth/state'
import slotsManagerReducer from './Slots/state'
import ContractFactory from './common/ContractFactory'
import ThorifyFactory from './common/helpers/ThorifyFactory'
import KeyStore from './common/helpers/KeyStore'
import KeyHandler from './common/helpers/KeyHandler'
import { CURRENT_ENV, ENV_DEVELOPMENT} from './config'

// Combine all Reducers
const CombinedReducers = combineReducers({
    app: appReducer,
    slotsManager: slotsManagerReducer,
    main: mainReducer,
    auth: authReducer
})

const keyHandler = new KeyHandler(new KeyStore())
const thorifyFactory = new ThorifyFactory(keyHandler)
const contractFactory = new ContractFactory(thorifyFactory, keyHandler)

// Setup middlewares
const middlewares = [
    ReduxThunk.withExtraArgument({  thorifyFactory, contractFactory, keyHandler }), // inject dependencies
    promiseMiddleware({ promiseTypeDelimiter: '/' })
]
// Only log redux on development
if (CURRENT_ENV === ENV_DEVELOPMENT) {
    middlewares.push(logger)
}

export default createStore(CombinedReducers, {}, applyMiddleware(...middlewares))
