import Helper from '../../Components/Helper'
import BettingProviderGameActions from '../actions/bettingProviderGameActions'
import OracleGameActions from '../actions/oracleGameActions'
import OracleBasicActions from '../actions/oracleBasicActions'

const helper = new Helper()

export default function sportsOracleWatchers(dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .sportsOracle()

    // Game Added
    contract.logGameAdded().watch((err, event) => {
        console.log('Game added event', err, JSON.stringify(event))
        let id = event.args.id.toNumber()
        dispatch(OracleGameActions.getGameItem(id))
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

        let action = BettingProviderGameActions.getGamePeriodOutcome(
            providerGameId,
            period
        )
        dispatch(action)
    })

    // Updated Time
    contract.logUpdatedTime().watch((err, event) => {
        console.log('Updated oracle time event', err, event)
        let time = event.args.time.toNumber()
        dispatch(OracleBasicActions.setTime(time))
    })
}
