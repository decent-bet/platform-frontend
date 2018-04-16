import Actions, { PREFIX } from './actionTypes'
import { createActions } from 'redux-actions'
import Helper from '../../Components/Helper'
import { getAesKey } from '../functions'

const helper = new Helper()

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [PREFIX]: {}
})
