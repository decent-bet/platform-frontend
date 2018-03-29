import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import { sportsBookReducer } from './Sportsbook/reducers'

let FinalReducer = combineReducers({
    sportsbook: sportsBookReducer
})

const store = createStore(
    FinalReducer,
    {},
    applyMiddleware(thunkMiddleware, promiseMiddleware(), logger)
)

export default store
