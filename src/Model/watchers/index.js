import tokenWatchers from './tokenWatchers'
import bettingProviderWatchers from './bettingProviderWatchers'
import sportsOracleWatchers from './sportsOracleWatchers'

export default function initWatchers(dispatch) {
    tokenWatchers(dispatch)
    bettingProviderWatchers(dispatch)
    sportsOracleWatchers(dispatch)
}
