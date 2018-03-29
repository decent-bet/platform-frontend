import { combineReducers } from 'redux'
import { bettingProviderReducer } from './bettingProvider'

export default combineReducers({
    bettingProvider: bettingProviderReducer
})