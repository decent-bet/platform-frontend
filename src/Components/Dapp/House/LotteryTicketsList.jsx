import React from 'react'
import Helper from '../../Helper'
import LotteryTicketsListItem from './LotteryTicketsListItem'

const helper = new Helper()

/**
 * Lists all the current Lottery Tickets for this wallet.
 * @param {Lottery} lottery Current Lottery
 */
export default function LotteryTicketsList({ lottery }) {
    if (!lottery) {
        return <p>No lotteries yet</p>
    }

    let account = helper.getWeb3().eth.defaultAccount
    if (!account) {
        return <p>Account not yet loaded</p>
    }

    let lotteryTickets = lottery.tickets
    if (!lotteryTickets) {
        return <p>No Lottery tickets for your address.</p>
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Ticket Number</th>
                </tr>
            </thead>

            <tbody>
                {lotteryTickets.map((ticket, index) => (
                    <LotteryTicketsListItem
                        key={ticket}
                        index={index}
                        ticket={ticket}
                    />
                ))}
            </tbody>
        </table>
    )
}
