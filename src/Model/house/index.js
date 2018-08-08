import actions, { fetchCurrentSessionId } from './actions'
import reducer from './reducer'

export const Actions = actions.house
export const Reducer = reducer

/**
 * Watches for purchased credits and updates when called.
 */
export async function initWatchers(...args) {
    let sessionNumber = await fetchCurrentSessionId()
    let { contractFactory } = args
    let contract = await contractFactory.houseContract()
    
    return dispatch => {
        contract
            .logPurchasedCredits(sessionNumber, 'latest')
            .on('data', (err, event) => {
                if (err) {
                    console.log('Purchased credits event error: ' + err)
                } else {
                    let balance = event.returnValues.balance
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
}
