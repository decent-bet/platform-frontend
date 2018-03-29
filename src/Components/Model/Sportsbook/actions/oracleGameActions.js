import Helper from '../../../Helper'
import { createAction } from 'redux-actions'
import { OracleActions } from '../actionTypes'

const helper = new Helper()

const IPFS = require('ipfs-mini')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

async function fetchMetadata(gameId, hash) {
    try {
        return new Promise(resolve => ipfs.catJSON(hash, resolve))
    } catch (err) {
        console.log('Error retrieving hash data', hash, err)
    }
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
            let periodNumber = period.toNumber()

            if (result.indexOf(periodNumber === -1)) {
                result.push(periodNumber)
            }

            iterator++
        } catch (err) {
            // Iteration ended
            iterate = false
        }
    }

    return result
}

async function fetchGamesItem(id) {
    try {
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
            game.periods = await fetchAvailableGamePeriods(id)
        }

        return game
    } catch (err) {
        console.log('Error retrieving game', id, err.message)
    }
}

async function fetchGamesCount() {
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

async function fetchGames() {
    let result = []
    let count = await fetchGamesCount()
    for (let index = 0; index < count; index++) {
        let game = await fetchGamesItem(index)
        if (game.exists) {
            result.push(game)
        }
    }
    return result
}

export const getGameItem = createAction(
    OracleActions.GET_GAME_ITEM,
    fetchGamesItem
)
export const getGames = createAction(OracleActions.GET_GAMES, fetchGames)
