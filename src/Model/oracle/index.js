import basicActions from './basicActions'
import gameActions from './gameActions'
import { Actions as BettingProviderActions } from '../bettingProvider'
import reducer from './reducer'
import Helper from '../../Components/Helper'

const helper = new Helper()

// Combine all actions into a single object
export const Actions = { ...basicActions.oracle, ...gameActions.oracle }
export const Reducer = reducer

export function initWatchers(...args) {
    return dispatch => {
        let { contractFactory } = args 
    let contract = contractFactory.sportsOracleContract()

    // Game Added
    contract.logGameAdded().on('data', (event) => {
        console.log('Game added event', JSON.stringify(event))
        let id = event.returnValues.id.toNumber()
        dispatch(Actions.getGameItem(id))
    }).on('error', (error) => {
        console.error('Game added event error', error)
    })

    // Updated provider outcome
    contract.logUpdatedProviderOutcome()
    .on('data', (event) => {
        console.log(
            'Updated provider outcome event',
            JSON.stringify(event)
        )
        let providerGameId = event.returnValues.providerGameId.toNumber()
        let period = event.returnValues.period.toNumber()

        helper.toggleSnackbar(`Results pushed for game - ID ${providerGameId}`)

        let action = BettingProviderActions.getGamePeriodOutcome(
            providerGameId,
            period
        )
        dispatch(action)
    }).on('error', (error) => {
        console.error('Updated provider outcome event error', error)
    })

    // Updated Time
    contract.logUpdatedTime().on('data', (event) => {
        console.log('Updated oracle time event', event)
        let time = event.returnValues.time.toNumber()
        dispatch(Actions.setTime(time))
    }).on('error', (error) => {
        console.error('Updated oracle time event error', error)
    })
    }
}
