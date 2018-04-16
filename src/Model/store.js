import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import { Reducer as bettingProviderReducer } from './bettingProvider'
import { Reducer as oracleReducer } from './oracle'
import { Reducer as balanceReducer } from './balance'
import { Reducer as houseReducer } from './house'
import { Reducer as slotsManagerReducer } from './slotsManager'
import { Reducer as spinsReducer } from './spins'

// Combine all Reducers
const CombinedReducers = combineReducers({
    house: houseReducer,
    slotsManager: slotsManagerReducer,
    spins: spinsReducer,
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    balance: balanceReducer
})

export default createStore(
    CombinedReducers,
    {},
    applyMiddleware(
        thunkMiddleware,
        promiseMiddleware({ promiseTypeDelimiter: '/' }),
        logger
    )
)
