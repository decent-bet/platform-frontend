const fse = require('fs-extra')
const rimraf = require('rimraf')

const SRC_PATH = 'games/slots/src'
const OUTPUT_PATH = 'public/slots'

const GAME_LIST = [
    {
        from: 'classic-7even/game',
        to: 'classic-7even'
    },
    {
        from: 'crypto-chaos/game',
        to: 'crypto-chaos'
    },
    {
        from: 'egyptian-treasures/game',
        to: 'egyptian-treasures'
    },
    {
        from: 'emoji-land/game',
        to: 'emoji-land'
    },
    {
        from: 'monster-mayhem/game',
        to: 'monster-mayhem'
    },
    {
        from: 'mount-crypto/game',
        to: 'mount-crypto'
    },
    {
        from: 'mythsmagic/game',
        to: 'mythsmagic'
    },
    {
        from: 'shiprekt/game',
        to: 'shiprekt'
    },
    {
        from: 'spaceman/game',
        to: 'spaceman'
    },
    {
        from: 'defcon/game',
        to: 'defcon'
    }
]

const gamesToCopy = GAME_LIST.map(game => {
    return {
        from: `${SRC_PATH}/${game.from}/`,
        to: `${OUTPUT_PATH}/${game.to}/`
    }
})

function clean() {
    return new Promise((resolve, reject) => {
        try {
            rimraf(OUTPUT_PATH, err => {
                if (err) {
                    throw err
                }

                console.log(`clean folder: ${OUTPUT_PATH}`)
                resolve()
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

async function copyGame(from, to) {
    try {
        await fse.copy(from, to)
        console.log(`Copy from: ${from} =>  to: ${to}`)
    } catch (err) {
        console.error(err)
    }
}

async function run() {
    await clean()
    gamesToCopy.forEach(async game => {
        await copyGame(game.from, game.to)
    })
}

run()
