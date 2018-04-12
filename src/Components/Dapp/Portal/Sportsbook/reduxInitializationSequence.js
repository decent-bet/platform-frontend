import {Actions as BettingProviderActions} from '../../../../Model/bettingProvider'
import {Actions as OracleActions} from '../../../../Model/oracle'

export default function initializationSequence(dispatch) {
    return Promise.all([
        dispatch(BettingProviderActions.getAddress()),
        dispatch(BettingProviderActions.getCurrentSession()),
        dispatch(BettingProviderActions.getHouseAddress()),
        dispatch(BettingProviderActions.getSportsoracleAddress()),
        dispatch(BettingProviderActions.getAllowance()),
        dispatch(BettingProviderActions.getTokenBalance()),
        dispatch(BettingProviderActions.getTime()),
        dispatch(BettingProviderActions.getDepositedTokens()),
        dispatch(BettingProviderActions.getSessionStats(1)),
        dispatch(BettingProviderActions.getUserBets()),

        dispatch(OracleActions.getTime()),
        dispatch(OracleActions.getGameUpdateCost()),
        dispatch(OracleActions.getRequestedProviderAddresses()),
        dispatch(OracleActions.getAcceptedProviderAddresses()),

        dispatch(BettingProviderActions.getGames()),
        dispatch(OracleActions.getGames())
    ])
}
