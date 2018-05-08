import Helper from '../../Components/Helper'
import Actions, { Prefix } from './actionTypes'
import { createActions } from 'redux-actions'

const helper = new Helper()

/**
 * Get the Current Session's Id Number
 */
export async function fetchCurrentSessionId() {
    try {
        let session = await helper
            .getContractHelper()
            .getWrappers()
            .house()
            .getCurrentSession()

        return session.toFixed(0)
    } catch (err) {
        console.log('Error retrieving current session')
    }
}

/**
 * Retrieves the users credits for a session
 * @param sessionNumber
 */
async function fetchUserCreditsForSession(sessionNumber) {
    try {
        let defaultAccount = helper.getWeb3().eth.defaultAccount
        return helper
            .getContractHelper()
            .getWrappers()
            .house()
            .getUserCreditsForSession(sessionNumber, defaultAccount)
    } catch (err) {
        console.log('Error retrieving user credits for session', sessionNumber)
    }
}

/**
 * Retrieve house fund details for a session - Total funds, purchased user credits, user credits
 * available, house payouts, withdrawn and profit
 * @param sessionNumber
 */
async function fetchHouseFunds(sessionNumber) {
    try {
        let houseFunds = await helper
            .getContractHelper()
            .getWrappers()
            .house()
            .getHouseFunds(sessionNumber)

        return {
            totalFunds: houseFunds[0].toFixed(0),
            totalPurchasedUserCredits: houseFunds[1].toFixed(0),
            totalUserCredits: houseFunds[2].toFixed(0),
            totalHousePayouts: houseFunds[3].toFixed(0),
            totalWithdrawn: houseFunds[4].toFixed(0),
            profit: houseFunds[5].toFixed(0)
        }
    } catch (err) {
        console.log('Error retrieving house funds', sessionNumber, err)
    }
}

/**
 * Retrieve all session details
 */
async function fetchSessionData() {
    try {
        let sessionId = await fetchCurrentSessionId()
        let adjustedSessionId = sessionId === '0' ? 1 : sessionId
        let session = await helper
            .getContractHelper()
            .getWrappers()
            .house()
            .getSession(adjustedSessionId)

        let sessionCredits = await fetchUserCreditsForSession(adjustedSessionId)
        let houseFunds = await fetchHouseFunds(adjustedSessionId)
        let lottery = await fetchLottery(adjustedSessionId)

        return {
            [adjustedSessionId]: {
                startTime: session[0].toFixed(0),
                endTime: session[1].toFixed(0),
                active: session[2],
                credits: sessionCredits[0].toFixed(0),
                houseFunds,
                lottery
            }
        }
    } catch (err) {
        console.log('Error retrieving session details')
    }
}

/**
 * Returns ticket numbers for a session lottery for the session
 * @param session
 * @param address
 */
async function fetchLotteryUserTickets(session, address) {
    let iterate = true
    let index = 0
    let array = []
    while (iterate) {
        try {
            let ticket = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .lotteryUserTickets(session, address, index)
            array.push(ticket)
            index++
        } catch (err) {
            // Expected. Stop Loop.
            iterate = false
        }
    }

    array = array.map((ticket) => {
        return ticket.toNumber()
    })

    return array
}

/**
 * Returns details for a session's lottery
 */
async function fetchLottery(session) {
    try {
        let lottery = await helper
            .getContractHelper()
            .getWrappers()
            .house()
            .lotteries(session)

        let address = helper.getWeb3().eth.defaultAccount
        let tickets = await fetchLotteryUserTickets(session, address)

        return {
            ticketCount: lottery[0].toFixed(0),
            winningTicket: lottery[1].toFixed(0),
            payout: lottery[2].toFixed(0),
            claimed: lottery[3],
            finalized: lottery[4],
            tickets
        }
    } catch (err) {
        console.log('Error retrieving lottery details', session, err.message)
    }
}

/**
 * Iterates over authorized addresses available in the house contract.
 */
async function fetchAuthorizedAddresses() {
    let iterate = true
    let index = 0
    let result = []
    while (iterate) {
        try {
            console.log('fetchAuthorizedAddresses')
            let address = await helper
                .getContractHelper()
                .getWrappers()
                .house()
                .getAuthorizedAddresses(index)
            result.push(address)
            index++
        } catch (error) {
            // Expected. Stop Loop.
            iterate = false
        }
    }

    return result
}

/**
 * Returns the allowance assigned to the house for DBETs assigned to the user's ETH address
 */
async function fetchHouseAllowance() {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .token()
            .allowance(
                helper.getWeb3().eth.defaultAccount,
                helper.getContractHelper().getHouseInstance().address
            )
    } catch (err) {
        console.log('Error retrieving house allowance', err.message)
    }
}

/**
 * Purchase session credits. Amount must be converted to 18 decimal places before buying.
 * @param amount
 */
async function executePurchaseCredits(amount) {
    try {
        return helper
            .getContractHelper()
            .getWrappers()
            .house()
            .purchaseCredits(amount)
    } catch (err) {
        console.log('Error sending purchase credits tx', err.message)
    }
}

/**
 * Approves the house contract to withdraw 'amount' DBETs from the user's ETH address and
 * purchases 'amount' credits
 * @param amount
 */
async function executeApproveAndPurchaseCredits(amount) {
    let house = helper.getContractHelper().getHouseInstance().address

    try {
        let tx = await helper
            .getContractHelper()
            .getWrappers()
            .token()
            .approve(house, amount)
        let tx2 = await executePurchaseCredits(amount)
        return { tx, tx2 }
    } catch (err) {
        console.log('Error sending approve tx', err)
    }
}

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.GET_HOUSE_SESSION_ID]: fetchCurrentSessionId,
        [Actions.GET_HOUSE_SESSION_DATA]: fetchSessionData,
        [Actions.GET_HOUSE_AUTHORIZED_ADDRESSES]: fetchAuthorizedAddresses,
        [Actions.GET_HOUSE_ALLOWANCE]: fetchHouseAllowance,
        [Actions.SET_HOUSE_PURCHASED_CREDITS]: (sessionNumber, credits) => ({
            sessionNumber,
            credits
        }),

        [Actions.PURCHASE_HOUSE_CREDITS]: executePurchaseCredits,
        [Actions.APPROVE_AND_PURCHASE_HOUSE_CREDITS]: executeApproveAndPurchaseCredits
    }
})
