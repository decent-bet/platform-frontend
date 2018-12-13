import { combineReducers } from 'redux'
import account from './reducer'
import transactionHistory from '../TransactionHistory/state'
import channelHistoryItem from '../TransactionHistory/ChannelHistoryItem/state'

export default combineReducers({
    account,
    transactionHistory,
    channelHistoryItem
})
