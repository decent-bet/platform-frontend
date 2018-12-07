import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import appReducer from './common/state'
import mainReducer from './Main/state'
import authReducer from './Auth/state'
import activateAccountReducer from './ActivateAccount/state'
import accountReducer from './Account/state'
import casinoReducer from './Casino/state'
import ContractFactory from './common/ContractFactory'
import ThorifyFactory from './common/helpers/ThorifyFactory'
import KeyStore from './common/helpers/KeyStore'
import KeyHandler from './common/helpers/KeyHandler'
import { RejectionCatcherMiddleware } from './common/helpers/RejectionCatcherMiddleware'
import { CURRENT_ENV, ENV_LOCAL } from './constants'
import Utils from './common/helpers/Utils'
import DecentWSAPI from './common/apis/DecentWSAPI'
import SlotsChannelHandler from './common/apis/SlotsChannelHandler'
import AuthProvider from './common/helpers/AuthProvider'
import { CometWallet } from './common/helpers/CometWallet'
import { IExternalWallet } from './common/types/IExternalWallet'

const bootstrapper = (externalWallet, thor) => {
    // Combine all Reducers
    const CombinedReducers = combineReducers({
        app: appReducer,
        main: mainReducer,
        auth: authReducer,
        account: accountReducer,
        activate: activateAccountReducer,
        casino: casinoReducer
    })

    const keyStore = new KeyStore()
    const keyHandler = new KeyHandler(keyStore)
    const thorifyFactory = new ThorifyFactory(thor, keyHandler)

    let comet: IExternalWallet | null = null
    if (externalWallet) {
        comet = new CometWallet(externalWallet)
    }

    const authProvider = new AuthProvider(keyHandler)
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
            slotsChannelHandler,
            authProvider,
            externalWallet: comet
        }), // inject dependencies
        promiseMiddleware({ promiseTypeDelimiter: '/' }),
        RejectionCatcherMiddleware
    ]

    // Only log redux on development
    if (CURRENT_ENV === ENV_LOCAL) {
        middlewares.push(logger)
    }

    return createStore(CombinedReducers, {}, applyMiddleware(...middlewares))
}
export default bootstrapper
