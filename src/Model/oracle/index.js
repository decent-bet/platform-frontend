import basicActions from './basicActions'
import gameActions from './gameActions'
import { Actions as BettingProviderActions } from '../bettingProvider'
import reducer from './reducer'
import Helper from '../../Components/Helper'

const helper = new Helper()

// Combine all actions into a single object
export const Actions = { ...basicActions.oracle, ...gameActions.oracle }
export const Reducer = reducer

export function initWatchers(dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .sportsOracle()

    // Game Added
    contract.logGameAdded().on('data', (event) => {
        console.log('Game added event', JSON.stringify(event))
        let id = event.args.id.toNumber()
        dispatch(Actions.getGameItem(id))
    }).on('error', (error) => {
        console.error('Game added event error', error)
    })

    // Updated provider outcome
    contract.logUpdatedProviderOutcome().on('data', (event) => {
        console.log(
            'Updated provider outcome event',
            JSON.stringify(event)
        )
        let providerGameId = event.args.providerGameId.toNumber()
        let period = event.args.period.toNumber()

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
        let time = event.args.time.toNumber()
        dispatch(Actions.setTime(time))
    }).on('error', (error) => {
        console.error('Updated oracle time event error', error)
    })
}

export function stopWatchers(_dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .sportsOracle()

    // TODO: As of Web3 1.beta33 this is broken.
    try {
        contract.logGameAdded().unsubscribe()
        contract.logUpdatedProviderOutcome().unsubscribe()
        contract.logUpdatedTime().unsubscribe()
    } catch (error) {
        console.warn('Web 3 Event deregistration broken')
    }
}
