import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import { Reducer as bettingProviderReducer } from './bettingProvider'
import { Reducer as oracleReducer } from './oracle'
import { Reducer as balanceReducer } from './balance'
import { Reducer as houseReducer } from './house'
import { Reducer as slotsManagerReducer } from './slotsManager'
import Helper from '../Components/Helper'

const helper = new Helper()

// Combine all Reducers
const CombinedReducers = combineReducers({
    house: houseReducer,
    slotsManager: slotsManagerReducer,
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    balance: balanceReducer
})

// Setup middleware
const middleware = [
    thunkMiddleware,
    promiseMiddleware({ promiseTypeDelimiter: '/' })
]

// Only log redux on development
if (helper.isDev()) {
    middleware.push(logger)
}

export default createStore(CombinedReducers, {}, applyMiddleware(...middleware))
