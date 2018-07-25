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
    contract.logDeposit()
    .on('data', (event) => {
        console.log('Deposit event', event)
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
    .on('error', (error) => {
        console.error('Deposit event error', error)
    })

    // Withdraw
    contract.logWithdraw()
    .on('data', (event) => {
        console.log('Withdraw event', event)
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
    .on('error', (error) => {
        console.error('Withdraw event error', error)
    })

    // New Bet
    contract.logNewBet()
    .on('data', (event) => {
        console.log('New bet event', JSON.stringify(event))
        let gameId = event.args.gameId.toNumber()
        helper.toggleSnackbar('New bet placed for game ID - ' + gameId)

        dispatch(Actions.getGameItem(gameId))
        dispatch(Actions.getUserBets())
        dispatch(BalanceActions.getTokens())
        dispatch(Actions.getDepositedTokens())
    })
    .on('error', (error) => {
        console.error('New bet event error', error)
    })

    // New Game
    contract.logNewGame()
    .on('data', (event) => {
        console.log('New game event', JSON.stringify(event))

        helper.toggleSnackbar('New game available for betting')

        let id = event.args.id.toNumber()
        dispatch(Actions.getGameItem(id))
    }).on('error', (error) => {
        console.error(console.log('New game event', error))
    })

    // New Game Odds
    contract.logNewGameOdds
    .on('data', (event) => {
        console.log('New game odds event', JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`New odds available for Game ID ${gameId} `)
        dispatch(Actions.getGameOdds(gameId))
    }).on('error', (error) => {
        console.error('New game event', error)
    })


    // Updated Game Odds
    contract.logUpdatedGameOdds()
    .on('data', ( event) => {
        console.log('Updated game odds event', JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`Odds updated for game ID ${gameId}`)
        dispatch(Actions.getGameOdds(gameId))
    }).on('error', (error) => {
        console.error('Updated game odds event error', error)
    })

    // Updated Max Bet
    contract.logUpdatedMaxBet()
    .on('data', (event) => {
        console.log('Updated max bet event', JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`Updated max bet for game - game ID ${gameId}`)

        dispatch(Actions.getGameBetLimit(gameId))
    }).on('error', (error) => {
        console.error('Updated max bet event error', error)
    })

    // Updated Bet Limits
    contract.logUpdatedBetLimits()
    .on('data', (event) => {
        console.log('Updated bet limits event', JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        let period = event.args.period.toNumber()

        helper.toggleSnackbar(`Updated bet limits for game - ID ${gameId}`)

        let action = Actions.getGameBetLimitForPeriod(gameId, period)
        dispatch(action)
    }).on('error', (error) => {
        console.error('Updated bet limits event error', error)
    })

    // Claimed Bet
    contract.logClaimedBet()
    .on('data', (event) => {
        let gameId = event.args.gameId.toNumber()

        helper.toggleSnackbar(`Claimed bet for game ID ${gameId}`)

        dispatch(BalanceActions.getTokens())
        dispatch(Actions.getDepositedTokens())
        dispatch(Actions.getUserBets())
    })
    .on('error', (error) => {
        console.error('logClaimedBet event error', error)
    })

    // Updated Time
    contract.logUpdatedTime()
    .on('data', (event) => {
        console.log('Updated provider time event', event)
        let time = event.args.time.toNumber()
        dispatch(Actions.setTime(time))
    })
    .on('error', (error) => {
        console.error('Updated provider time event error', error)
    })
}
