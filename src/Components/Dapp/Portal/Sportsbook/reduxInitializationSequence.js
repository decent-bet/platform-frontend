import BettingProviderActions from '../../../../Model/actions/bettingProviderActions'
import BetActions from '../../../../Model/actions/betActions'
import OracleBasicActions from '../../../../Model/actions/oracleBasicActions'
import OracleGameActions from '../../../../Model/actions/oracleGameActions'
import BettingProviderGameActions from '../../../../Model/actions/bettingProviderGameActions'

export default function initializationSequence(dispatch){
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

    dispatch(BetActions.getUserBets()),

    dispatch(OracleBasicActions.getTime()),
    dispatch(OracleBasicActions.getGameUpdateCost()),
    dispatch(OracleBasicActions.getRequestedProviderAddresses()),
    dispatch(OracleBasicActions.getAcceptedProviderAddresses()),

    dispatch(BettingProviderGameActions.getGames()),

    dispatch(OracleGameActions.getGames())
  ])
}