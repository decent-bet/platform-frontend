import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import { Reducer as balanceReducer } from './balance'
import { Reducer as authReducer } from './auth'
import { Reducer as slotsManagerReducer, SlotsChannelHandler } from './slotsManager'
import Helper from '../Components/Helper'
import { ChainProvider } from '../Web3/ChainProvider'
import KeyHandler from './KeyHandler'
import { KeyStore } from './KeyStore'
import DecentWSApi from './websockets/DecentWSAPI'
import { Utils } from './Utils'
const Web3 = require('web3')

// Combine all Reducers
const CombinedReducers = combineReducers({
    slotsManager: slotsManagerReducer,
    balance: balanceReducer,
    auth: authReducer
})

const helper = new Helper()

const keyHandler = new KeyHandler(new KeyStore()) //setup the key store and the key handler
const chainProvider = new ChainProvider(new Web3(), keyHandler) //setup the ChainProvider and
const wsApi = new DecentWSApi(keyHandler, helper)
const utils = new Utils(chainProvider, keyHandler, wsApi)
const slotsChannelHandler = new SlotsChannelHandler(wsApi, helper, utils)

// Setup middleware
const middlewares = [
    ReduxThunk.withExtraArgument({ chainProvider, keyHandler, wsApi, utils, helper, slotsChannelHandler }), //inject dependencies
    promiseMiddleware({ promiseTypeDelimiter: '/' })
]

// Only log redux on development
if (helper.isDev()) {
    middlewares.push(logger)
}

export default createStore(CombinedReducers, {}, applyMiddleware(...middlewares))
