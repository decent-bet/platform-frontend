import Actions from './index'
import { Actions as BalanceActions } from '../balance'
import Helper from '../../Components/Helper'
/*no-unused-vars dispatch getState*/
const helper = new Helper()

function filterEvents(events) {
        if(events && events.length > 0) {
            let [event] = events
             return event
        }
    return null
}

export function logDeposit(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logDeposit()
        const event = filterEvents(events)
        if(event) {
            console.log('Deposit event', event)
                const amount = event.returnValues.amount.toString()
                const session = event.returnValues.session.toNumber()
                helper.toggleSnackbar(
                    'DBETs deposited into sportsbook contract - ' +
                        helper.formatEther(amount) +
                        ' DBETs'
                )

                dispatch(BalanceActions.getTokens(chainProvider))
                dispatch(Actions.getTokenBalance(chainProvider))
                dispatch(Actions.getDepositedTokens(session, chainProvider))
        }
    }
}

export function logWithdraw(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logWithdraw()
        const event = filterEvents(events)
        if(event) {
            console.log('Withdraw event', event)
            const amount = event.returnValues.amount.toString()
            const session = event.returnValues.session.toNumber()

            helper.toggleSnackbar(
                'DBETs withdrawn from sportsbook contract - ' +
                    helper.formatEther(amount) +
                    ' DBETs'
            )

            dispatch(BalanceActions.getTokens(chainProvider))
            dispatch(Actions.getTokenBalance(chainProvider))
            dispatch(Actions.getDepositedTokens(session, chainProvider))
        }
    }
}

export function logNewBet(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logNewBet()
        const event = filterEvents(events)
        if(event) {
            console.log('New bet event', JSON.stringify(event))
                let gameId = event.returnValues.gameId.toNumber()
                helper.toggleSnackbar(
                    'New bet placed for game ID - ' + gameId
                )

                dispatch(Actions.getGameItem(gameId, chainProvider))
                dispatch(Actions.getUserBets(chainProvider))
                dispatch(BalanceActions.getTokens(chainProvider))
                dispatch(Actions.getDepositedTokens(chainProvider))
        }
    }
}

export function logNewGame(contract) {
    return async (dispatch, getState, chainProvider ) => {
        const events = await contract.logNewGame()
        const event = filterEvents(events)
        if(event) {
            console.log('New game event', JSON.stringify(event))

            helper.toggleSnackbar('New game available for betting')

            let id = event.returnValues.id.toNumber()
            dispatch(Actions.getGameItem(id, chainProvider))
        }

    }
}

export function logNewGameOdds(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logNewGameOdds()
        const event = filterEvents(events)
        if(event) {
            console.log('New game odds event', JSON.stringify(event))
                let gameId = event.returnValues.id.toNumber()
                helper.toggleSnackbar(
                    `New odds available for Game ID ${gameId} `
                )
                dispatch(Actions.getGameOdds(gameId, chainProvider))
        }

    }
}

export function logUpdatedGameOdds(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logUpdatedGameOdds()
        const event = filterEvents(events)
        if(event) {
            console.log(
                'Updated game odds event',
                JSON.stringify(event)
            )
            let gameId = event.returnValues.id.toNumber()
            helper.toggleSnackbar(`Odds updated for game ID ${gameId}`)
            dispatch(Actions.getGameOdds(gameId, chainProvider))
        }

    }
}

export function logUpdatedMaxBet(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logUpdatedMaxBet()
        const event = filterEvents(events)
        if(event) {
            console.log('Updated max bet event', JSON.stringify(event))
                let gameId = event.returnValues.id.toNumber()
                helper.toggleSnackbar(
                    `Updated max bet for game - game ID ${gameId}`
                )

                dispatch(Actions.getGameBetLimit(gameId, chainProvider))
        }

    }
}

export function logUpdatedBetLimits(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logUpdatedBetLimits()
        const event = filterEvents(events)
        if(event) {
            console.log(
                'Updated bet limits event',
                JSON.stringify(event)
            )
            let gameId = event.returnValues.id.toNumber()
            let period = event.returnValues.period.toNumber()

            helper.toggleSnackbar(
                `Updated bet limits for game - ID ${gameId}`
            )
            dispatch(Actions.getGameBetLimitForPeriod(
                gameId,
                period,
                chainProvider
            ))
        }
    }
}

export function logClaimedBet(contract) {
    return async (dispatch, getState, { chainProvider }) => {
        const events = await contract.logClaimedBet()
        const event = filterEvents(events)
        if(event) {
            let gameId = event.returnValues.gameId.toNumber()

                helper.toggleSnackbar(`Claimed bet for game ID ${gameId}`)

                dispatch(BalanceActions.getTokens(chainProvider))
                dispatch(Actions.getDepositedTokens(chainProvider))
                dispatch(Actions.getUserBets(chainProvider))
        }
    }
}

export function logUpdatedTime(contract) {
    return async (dispatch) => {
        const events = await contract.logUpdatedTime()
        const event = filterEvents(events)
        if(event) {
            console.log('Updated provider time event', event)
            let time = event.returnValues.time.toNumber()
            dispatch(Actions.setTime(time))
        }

    }
}


export function startEventListeners() {
    return async (dispatch, getState, { contractFactory }) => {
        try {
            let contract = await contractFactory.bettingProviderContract()
            //await logDeposit(contract)
            //await logWithdraw(contract)
            //await logNewBet(contract)
            //await logNewGame(contract)
            //await logNewGameOdds(contract)
            //await logUpdatedGameOdds(contract)
           // await logUpdatedMaxBet(contract)
            //await logUpdatedBetLimits(contract)
            //await logClaimedBet(contract)
            //await dispatch(logUpdatedTime(contract))
        } catch (error) {
            console.error(`Betting Provider Event error:`, error)
        }
    }
}
