import { combineReducers } from 'redux'
import account from './reducer'
import transactionHistory from '../TransactionHistory/state'

export default combineReducers({
    account,
    transactionHistory
})
