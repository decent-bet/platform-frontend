import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'
import { Reducer as bettingProviderReducer } from './bettingProvider'
import { Reducer as oracleReducer } from './oracle'
import { Reducer as balanceReducer } from './balance'
import { Reducer as houseReducer } from './house'
import { Reducer as authReducer } from './auth'
import { Reducer as slotsManagerReducer } from './slotsManager'
import Helper from '../Components/Helper'
import { ChainProvider } from '../Web3/ChainProvider'
import KeyHandler from '../Web3/KeyHandler'
const Web3 = require('web3')
const helper = new Helper()

// Combine all Reducers
const CombinedReducers = combineReducers({
    house: houseReducer,
    slotsManager: slotsManagerReducer,
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    balance: balanceReducer,
    auth: authReducer
})

//setup the ChainProvider
const chainProvider = new ChainProvider(new Web3(), new KeyHandler())
// Setup middleware
const middlewares = [
    ReduxThunk.withExtraArgument({chainProvider}), //inject the ChainProvider instance like a DI
    promiseMiddleware({ promiseTypeDelimiter: '/' })
]

// Only log redux on development
if (helper.isDev()) {
    middlewares.push(logger)
}

export default createStore(CombinedReducers, {}, applyMiddleware(...middlewares))
