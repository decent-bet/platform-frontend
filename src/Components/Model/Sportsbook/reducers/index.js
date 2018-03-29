import { combineReducers } from 'redux'
import { bettingProviderReducer } from './bettingProvider'
import { oracleReducer } from './sportsOracle'
import { tokenReducer } from './token'

export default combineReducers({
    bettingProvider: bettingProviderReducer,
    sportsOracle: oracleReducer,
    token: tokenReducer
})
