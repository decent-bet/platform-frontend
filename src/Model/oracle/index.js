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
    contract.logGameAdded().watch((err, event) => {
        console.log('Game added event', err, JSON.stringify(event))
        let id = event.args.id.toNumber()
        dispatch(Actions.getGameItem(id))
    })

    // Updated provider outcome
    contract.logUpdatedProviderOutcome().watch((err, event) => {
        console.log(
            'Updated provider outcome event',
            err,
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
    })

    // Updated Time
    contract.logUpdatedTime().watch((err, event) => {
        console.log('Updated oracle time event', err, event)
        let time = event.args.time.toNumber()
        dispatch(Actions.setTime(time))
    })
}

export function stopWatchers(_dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .sportsOracle()

    // TODO: As of Web3 1.beta33 this is broken.
    try {
        contract.logGameAdded().stopWatching()
        contract.logUpdatedProviderOutcome().stopWatching()
        contract.logUpdatedTime().stopWatching()
    } catch (error) {
        console.warn('Web 3 Event deregistration broken')
    }
}
