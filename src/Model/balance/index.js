import actions from './actions'
import reducer from './reducer'
import Helper from '../../Components/Helper'

const helper = new Helper()

export const Actions = actions.balance
export const Reducer = reducer
export function initWatchers(dispatch) {
    let tokenContract = helper
        .getContractHelper()
        .getWrappers()
        .token()

    let address = helper.getWeb3().eth.defaultAccount

    // Transfer from
    tokenContract.logTransfer(address, true)
    .on('data', (event) => {
        dispatch(Actions.getTokens())
    })

    //Transfer To
    tokenContract.logTransfer(address, false).on('data', (event) => {
        dispatch(Actions.getTokens())
    })
}
