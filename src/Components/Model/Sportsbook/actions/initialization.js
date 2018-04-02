import {
    getAddress,
    getCurrentSession,
    getHouseAddress,
    getSportsOracleAddress,
    getAllowance,
    getTokenBalance,
    getTime,
    getSessionStats,
    getUserBets
} from './bettingProviderActions'
import {
    getTime as getOracleTime,
    getGameUpdateCost,
    getRequestedProviderAddresses,
    getAcceptedProviderAddresses
} from './oracleBasicActions'
import { getGames as getOracleGames } from './oracleGameActions'
import { getGames } from './bettingProviderGameActions'
import { getTokenBalance as getTokenBalance2 } from './bettingProviderActions'
import Promise from 'bluebird'

export default async function initializationSequence() {
    return dispatch => Promise.all(
            dispatch(getAddress()),
            dispatch(getCurrentSession()),
            dispatch(getHouseAddress()),
            dispatch(getSportsOracleAddress()),
            dispatch(getAllowance()),
            dispatch(getTokenBalance()),
            dispatch(getTime()),
            dispatch(getGames()),
            dispatch(getSessionStats(1)),
            dispatch(getUserBets(0)),
            dispatch(getOracleTime()),
            dispatch(getOracleGames()),
            dispatch(getGameUpdateCost()),
            dispatch(getRequestedProviderAddresses()),
            dispatch(getAcceptedProviderAddresses()),
            dispatch(getTokenBalance2())
        )
}


