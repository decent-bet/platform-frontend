import betActions from './betActions'
import baseActions from './baseActions'
import gameActions from './gameActions'
import reducer from './reducer'

// Merge all the actions into a single object
export const Actions = {
    ...betActions.bettingProvider,
    ...baseActions.bettingProvider,
    ...gameActions.bettingProvider
}

export const Reducer = reducer

