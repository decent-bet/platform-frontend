import { combineReducers } from 'redux'
import bettingProviderReducer from './bettingProviderReducer'
import oracleReducer from './sportsOracleReducer'
import tokenReducer from './tokenReducer'
import houseReducer from './houseReducer'

export default combineReducers({
    house: houseReducer,
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    token: tokenReducer
})
