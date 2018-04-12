import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import Bluebird from 'bluebird'
import IPFS from 'ipfs-mini'

const helper = new Helper()
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

async function fetchMetadata(gameId, hash) {
    return Bluebird.fromCallback(resolver => ipfs.catJSON(hash, resolver))
}

async function fetchAvailableGamePeriods(id) {
    let result = []
    let iterate = true
    let iterator = 0
    while (iterate) {
        try {
            let period = await helper
                .getContractHelper()
                .getWrappers()
                .sportsOracle()
                .getAvailableGamePeriods(id, iterator)
            if (period) {
                let periodNumber = period.toNumber()
                if (result.indexOf(periodNumber === -1)) {
                    result.push(periodNumber)
                }
            }

            iterator++
        } catch (err) {
            // Iteration ended
            iterate = false
        }
    }

    return result
}

export async function fetchOracleGamesItem(id) {
    let data = await helper
        .getContractHelper()
        .getWrappers()
        .sportsOracle()
        .getGame(id)
    let ipfsHash = data[6]
    let exists = data[7]
    let game = {
        id: id,
        refId: data[1],
        sportId: data[2].toNumber(),
        leagueId: data[3].toNumber(),
        startTime: data[4].toNumber(),
        endTime: data[5].toNumber(),
        ipfsHash: ipfsHash,
        exists: exists
    }
    if (ipfsHash.length > 0) {
        let metadata = await fetchMetadata(id, ipfsHash)
        if (metadata) {
            game.team1 = metadata.team1
            game.team2 = metadata.team2
            game.starts = metadata.starts
            game.league = metadata.league
            game.periodDescriptions = metadata.periods
        }
    }
    if (exists) {
        let periodArray = await fetchAvailableGamePeriods(id)
        game.periods = periodArray
    }

    return game
}

async function fetchOracleGamesCount() {
    try {
        let gamesCount = await helper
            .getContractHelper()
            .getWrappers()
            .sportsOracle()
            .getGamesCount()

        return gamesCount.toNumber()
    } catch (err) {
        console.log('Error retrieving games count:', err)
    }
}

async function fetchOracleGames() {
    let result = []
    let count = await fetchOracleGamesCount()
    for (let index = 0; index < count; index++) {
        let game = await fetchOracleGamesItem(index)
        if (game.exists) {
            result.push(game)
        }
    }
    return result
}

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.GET_GAME_ITEM]: fetchOracleGamesItem,
        [Actions.GET_GAMES]: fetchOracleGames
    }
})
