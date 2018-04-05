import Helper from '../../Components/Helper'
import BalanceActions from '../actions/balanceActions'

const helper = new Helper()

export default function tokenWatchers(dispatch) {
    let tokenContract = helper
        .getContractHelper()
        .getWrappers()
        .token()

    let address = helper.getWeb3().eth.defaultAccount

    // Transfer from
    tokenContract.logTransfer(address, true).watch((err, event) => {
        if (!err) dispatch(BalanceActions.getTokens())
    })

    //Transfer To
    tokenContract.logTransfer(address, false).watch((err, event) => {
        if (!err) dispatch(BalanceActions.getTokens())
    })
}
