import { combineReducers } from 'redux'
import bettingProviderReducer from './bettingProviderReducer'
import oracleReducer from './sportsOracleReducer'
import tokenReducer from './tokenReducer'
import houseReducer from './houseReducer'
import slotsManagerReducer from './slotsManagerReducer'

export default combineReducers({
    house: houseReducer,
    slotsManager: slotsManagerReducer,
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    token: tokenReducer
})
