import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import CombinedReducers from './reducers'

export default createStore(
    CombinedReducers,
    {},
    applyMiddleware(thunkMiddleware, promiseMiddleware(), logger)
)
