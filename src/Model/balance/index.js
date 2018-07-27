import actions from './actions'
import reducer from './reducer'
import { ThorConnection } from '../../Web3/ThorConnection'

export const Actions = actions.balance
export const Reducer = reducer
export function initWatchers(dispatch) {
    let tokenContract = ThorConnection.contractFactory().decentBetTokenContract

    let address = ThorConnection.getDefaultAccount()

    // Transfer from
    tokenContract.logTransfer(address, true)
                .on('data', (event) => {
                    dispatch(Actions.getTokens())
                })

    //Transfer To
    tokenContract.logTransfer(address, false)
                .on('data', (event) => {

                    dispatch(Actions.getTokens())
                })
}
