import { combineReducers } from 'redux'
import { bettingProviderReducer } from './bettingProvider'
import { oracleReducer } from './sportsOracle'

export default combineReducers({
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer
})
