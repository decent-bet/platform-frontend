import Helper from '../../Components/Helper'
import { createAction } from 'redux-actions'
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

export const getTime = createAction(OracleActions.GET_TIME, fetchTime)
export const getOwner = createAction(OracleActions.GET_OWNER, fetchOwner)
export const getGameUpdateCost = createAction(
    OracleActions.GET_GAME_UPDATE_COST,
    fetchGameUpdateCost
)
export const getRequestedProviderAddresses = createAction(
    OracleActions.GET_REQUESTED_PROVIDER_ADDRESSES,
    fetchRequestedProviderAddresses
)
export const getAcceptedProviderAddresses = createAction(
    OracleActions.GET_ACCEPTED_PROVIDER_ADDRESSES,
    fetchAcceptedProviderAddresses
)
