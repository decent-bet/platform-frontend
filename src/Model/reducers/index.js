import { combineReducers } from 'redux'
import bettingProviderReducer from './bettingProviderReducer'
import oracleReducer from './sportsOracleReducer'
import tokenReducer from './tokenReducer'

export default combineReducers({
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    token: tokenReducer
})
