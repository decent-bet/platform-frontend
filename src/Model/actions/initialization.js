import BettingProviderActions from './bettingProviderActions'
import BetActions from './betActions'
import OracleBasicActions from './oracleBasicActions'
import OracleGameActions from './oracleGameActions'
import BettingProviderGameActions from './bettingProviderGameActions'
import Promise from 'bluebird'

export default async function initializationSequence(dispatch) {
    return Promise.all(
        dispatch(BettingProviderActions.getAddress()),
        dispatch(BettingProviderActions.getCurrentSession()),
        dispatch(BettingProviderActions.getHouseAddress()),
        dispatch(BettingProviderActions.getSportsoracleAddress()),
        dispatch(BettingProviderActions.getAllowance()),
        dispatch(BettingProviderActions.getTokenBalance()),
        dispatch(BettingProviderActions.getTime()),
        dispatch(BettingProviderActions.getDepositedTokens()),
        dispatch(BettingProviderActions.getSessionStats(1)),

        dispatch(BetActions.getUserBets()),

        dispatch(OracleBasicActions.getTime()),
        dispatch(OracleBasicActions.getGameUpdateCost()),
        dispatch(OracleBasicActions.getRequestedProviderAddresses()),
        dispatch(OracleBasicActions.getAcceptedProviderAddresses()),

        dispatch(BettingProviderGameActions.getGames()),

        dispatch(OracleGameActions.getGames())
    )
}
