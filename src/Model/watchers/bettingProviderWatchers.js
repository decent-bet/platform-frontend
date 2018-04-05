import Helper from '../../Components/Helper'
import BalanceActions from '../actions/balanceActions'
import BetActions from '../actions/betActions'
import BettingProviderActions from '../actions/bettingProviderActions'
import BettingProviderGameActions from '../actions/bettingProviderGameActions'

const helper = new Helper()

export default function bettingProviderWachers(dispatch) {
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
        dispatch(BettingProviderActions.getDepositedTokens(session))
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
        dispatch(BettingProviderActions.getDepositedTokens(session))
    })

    // New Bet
    contract.logNewBet().watch((err, event) => {
        console.log('New bet event', err, JSON.stringify(event))
        let gameId = event.args.gameId.toNumber()
        helper.toggleSnackbar('New bet placed for game ID - ' + gameId)

        dispatch(BettingProviderGameActions.getGameItem(gameId))
        dispatch(BetActions.getUserBets())
        dispatch(BalanceActions.getTokens())
        dispatch(BettingProviderActions.getDepositedTokens())
    })

    // New Game
    contract.logNewGame().watch((err, event) => {
        console.log('New game event', err, JSON.stringify(event))

        helper.toggleSnackbar('New game available for betting')

        let id = event.args.id.toNumber()
        dispatch(BettingProviderGameActions.getGameItem(id))
    })

    // New Game Odds
    contract.logNewGameOdds().watch((err, event) => {
        console.log('New game odds event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()

        helper.toggleSnackbar(`New odds available for Game ID ${gameId} `)

        dispatch(BettingProviderGameActions.getGameOddsCount(gameId))
    })

    // Updated Game Odds
    contract.logUpdatedGameOdds().watch((err, event) => {
        console.log('Updated game odds event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`Odds updated for game ID ${gameId}`)

        dispatch(BettingProviderGameActions.getGameOddsCount(gameId))
    })

    // Updated Max Bet
    contract.logUpdatedMaxBet().watch((err, event) => {
        console.log('Updated max bet event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        helper.toggleSnackbar(`Updated max bet for game - game ID ${gameId}`)

        dispatch(BettingProviderGameActions.getMaxBetLimit(gameId))
    })

    // Updated Bet Limits
    contract.logUpdatedBetLimits().watch((err, event) => {
        console.log('Updated bet limits event', err, JSON.stringify(event))
        let gameId = event.args.id.toNumber()
        let period = event.args.period.toNumber()

        helper.toggleSnackbar(`Updated bet limits for game - ID ${gameId}`)

        let action = BettingProviderGameActions.getBetLimitForPeriod(
            gameId,
            period
        )
        dispatch(action)
    })

    // Claimed Bet
    contract.logClaimedBet().watch((err, event) => {
        let gameId = event.args.gameId.toNumber()

        helper.toggleSnackbar(`Claimed bet for game ID ${gameId}`)

        dispatch(BalanceActions.getTokens())
        dispatch(BettingProviderActions.getDepositedTokens())
        dispatch(BetActions.getUserBets())
    })

    // Updated Time
    contract.logUpdatedTime().watch((err, event) => {
        console.log('Updated provider time event', err, event)
        let time = event.args.time.toNumber()
        dispatch(BettingProviderActions.setTime(time))
    })
}
