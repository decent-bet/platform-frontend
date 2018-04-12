import actions, { fetchCurrentSessionId } from './actions'
import reducer from './reducer'
import Helper from '../../Components/Helper'

const helper = new Helper()

export const Actions = actions.house
export const Reducer = reducer

/**
 * Watches for purchased credits and updates when called.
 */
export async function initWatchers(dispatch) {
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
                    Actions.setHousePurchasedCredits(
                        sessionNumber,
                        balance.toFixed(0)
                    )
                )
                dispatch(Actions.getHouseSessionData())
            }
        })
}

export function stopWatchers(dispatch) {
    // TODO: As of Web3 1.0.0.beta33, this function is broken
    try {
        helper
            .getContractHelper()
            .getWrappers()
            .house()
            .logPurchasedCredits()
            .stopWatching()
    } catch (error) {
        console.warn('Web3 deregistration broken')
    }
}
