import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import { OracleActions } from '../actionTypes'

const ethUnits = require('ethereum-units')
const helper = new Helper()

async function fetchOwner() {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .sportsOracle()
            .getOwner()
    } catch (err) {
        console.log('Error retrieving owner')
    }
}

async function fetchGameUpdateCost() {
    try {
        let gameUpdateCost = await helper
            .getContractHelper()
            .getWrappers()
            .sportsOracle()
            .getGameUpdateCost()
        return gameUpdateCost.div(ethUnits.units.ether).toNumber()
    } catch (err) {
        console.log('Error retrieving game update cost', err.message)
    }
}

async function fetchRequestedProviderAddresses() {
    let result = []
    let iterate = true
    let index = 0

    while (iterate) {
        try {
            let address = await helper
                .getContractHelper()
                .getWrappers()
                .sportsOracle()
                .getRequestedProviderAddresses(index)
            if (address !== '0x') {
                result.push(address)
                index++
            }
        } catch (error) {
            iterate = false
        }
    }

    return result
}

async function fetchAcceptedProviderAddresses() {
    let result = []
    let iterate = true
    let index = 0

    while (iterate) {
        try {
            let address = await helper
                .getContractHelper()
                .getWrappers()
                .sportsOracle()
                .getAcceptedProviderAddresses(index)

            if (address !== '0x') {
                result.push(address)
            }

            index++
        } catch (error) {
            iterate = false
        }
    }

    return result
}

async function fetchTime() {
    let time = await helper
        .getContractHelper()
        .getWrappers()
        .sportsOracle()
        .getTime()
    return time.toNumber()
}

// Functions of this object are the Action Keys "inCamelCase"
// See 'redux-actions' for details
export default createActions({
    [OracleActions.GET_TIME]: fetchTime,
    [OracleActions.GET_OWNER]: fetchOwner,
    [OracleActions.GET_GAME_UPDATE_COST]: fetchGameUpdateCost,
    [OracleActions.GET_REQUESTED_PROVIDER_ADDRESSES]: fetchRequestedProviderAddresses,
    [OracleActions.GET_ACCEPTED_PROVIDER_ADDRESSES]: fetchAcceptedProviderAddresses,
    [OracleActions.SET_TIME]: time => time
})
