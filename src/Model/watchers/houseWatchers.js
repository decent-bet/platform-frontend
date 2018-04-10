import { HouseActions, fetchCurrentSessionId } from '../actions/houseActions'
import Helper from '../../Components/Helper'

const helper = new Helper()

/**
 * Watches for purchased credits and updates when called.
 * @param sessionNumber Session Number
 */
async function init(dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .house()

    let sessionNumber = await fetchCurrentSessionId()
    contract
        .logPurchasedCredits(sessionNumber, 'latest')
        .watch((err, event) => {
            if (err) {
                console.log('Purchased credits event error: ' + err)
            } else {
                let balance = event.args.balance
                dispatch(
                    HouseActions.setHousePurchasedCredits(
                        sessionNumber,
                        balance.toFixed(0)
                    )
                )
                dispatch(HouseActions.getHouseSessionData())
            }
        })
}

function stop(dispatch) {
    // TODO: As of Web3 1.0.0.beta33, this function is broken
    try {
        helper
            .getContractHelper()
            .getWrappers()
            .house()
            .logPurchasedCredits()
            .stopWatching()
    } catch (error) {
        console.log('Web3 error')
    }
}

export default { init, stop }
