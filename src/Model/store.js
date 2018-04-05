import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import sportsBookReducer from './reducers'

export default createStore(
    sportsBookReducer,
    {},
    applyMiddleware(thunkMiddleware, promiseMiddleware(), logger)
)
