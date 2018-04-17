import betActions from './betActions'
import baseActions from './baseActions'
import gameActions from './gameActions'
import reducer from './reducer'
import { Actions as BalanceActions } from '../balance'
import Helper from '../../Components/Helper'

const helper = new Helper()

// Merge all the actions into a single object
export const Actions = {
    ...betActions.bettingProvider,
    ...baseActions.bettingProvider,
    ...gameActions.bettingProvider
}
export const Reducer = reducer

export function stopWatchers(_dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .bettingProvider()

    // TODO: As of Web3 1.beta33 this is broken.
    try {
        contract.logDeposit().stopWatching()
        contract.logWithdraw().stopWatching()
        contract.logNewBet().stopWatching()
        contract.logNewGame().stopWatching()
        contract.logNewGameOdds().stopWatching()
        contract.logUpdatedGameOdds().stopWatching()
        contract.logUpdatedMaxBet().stopWatching()
        contract.logUpdatedBetLimits().stopWatching()
        contract.logClaimedBet().stopWatching()
        contract.logUpdatedTime().stopWatching()
    } catch (error) {
        console.warn('Web 3 Event deregistration broken')
    }
}

export function initWatchers(dispatch) {
    let contract = helper
        .getContractHelper()
        .getWrappers()
        .bettingProvider()

    // Deposit
    contract.logDeposit().watch((err, event) => {
        console.log('Deposit event', err, event)
        const amount = event.args.amount.toString()
        const session = event.args.session.toNumber()

        helper.toggleSnackbar(
            'DBETs deposited into sportsbook contract - ' +
                helper.formatEther(amount) +
                ' DBETs'
        )

        dispatch(BalanceActions.getTokens())
        dispatch(Actions.getTokenBalance())
        dispatch(Actions.getDepositedTokens(session))
    })

    // Withdraw
    contract.logWithdraw().watch((err, event) => {
        console.log('Withdraw event', err, event)
        const amount = event.args.amount.toString()
        const session = event.args.session.toNumber()

        helper.toggleSnackbar(
            'DBETs withdrawn from sportsbook contract - ' +
                helper.formatEther(amount) +
                ' DBETs'
        )

        dispatch(BalanceActions.getTokens())
        dispatch(Actions.getTokenBalance())
        dispatch(Actions.getDepositedTokens(session))
    })

    // New Bet
    contract.logNewBet().watch((err, event) => {
        console.log('New bet event', err, JSON.stringify(event))
        let gameId = event.args.gameId.toNumber()
        helper.toggleSnackbar('New bet placed for game ID - ' + gameId)

        dispatch(Actions.getGameItem(gameId))
        dispatch(Actions.getUserBets())
        dispatch(BalanceActions.getTokens())
        dispatch(Actions.getDepositedTokens())
    })

    // New Game
    contract.logNewGame().watch((err, event) => {
        console.log('New game event', err, JSON.stringify(event))

        helper.toggleSnackbar('New game available for betting')

        let id = event.args.id.toNumber()
        dispatch(Actions.getGameItem(id))
    })

    // New Game Odds
    contract.logNewGameOdds().watch((err, event) => {
        console.log('New game odds event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`New odds available for Game ID ${gameId} `)
        dispatch(Actions.getGameOdds(gameId))
    })

    // Updated Game Odds
    contract.logUpdatedGameOdds().watch((err, event) => {
        console.log('Updated game odds event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`Odds updated for game ID ${gameId}`)
        dispatch(Actions.getGameOdds(gameId))
    })

    // Updated Max Bet
    contract.logUpdatedMaxBet().watch((err, event) => {
        console.log('Updated max bet event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`Updated max bet for game - game ID ${gameId}`)

        dispatch(Actions.getGameBetLimit(gameId))
    })

    // Updated Bet Limits
    contract.logUpdatedBetLimits().watch((err, event) => {
        console.log('Updated bet limits event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        let period = event.args.period.toNumber()

        helper.toggleSnackbar(`Updated bet limits for game - ID ${gameId}`)

        let action = Actions.getGameBetLimitForPeriod(gameId, period)
        dispatch(action)
    })

    // Claimed Bet
    contract.logClaimedBet().watch((err, event) => {
        let gameId = event.args.gameId.toNumber()

        helper.toggleSnackbar(`Claimed bet for game ID ${gameId}`)

        dispatch(BalanceActions.getTokens())
        dispatch(Actions.getDepositedTokens())
        dispatch(Actions.getUserBets())
    })

    // Updated Time
    contract.logUpdatedTime().watch((err, event) => {
        console.log('Updated provider time event', err, event)
        let time = event.args.time.toNumber()
        dispatch(Actions.setTime(time))
    })
}
