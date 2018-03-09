import React from 'react'
import Helper from '../../Helper'
import LotteryListItem from './LotteryListItem'

const helper = new Helper()

/**
 * Lists all the current Lottery Tickets for this wallet.
 * @param {Lottery} lottery Current Lottery
 */
export default function LotteryList({ lottery }) {
    if (!lottery) {
        return <p>No lotteries yet</p>
    }

    let account = helper.getWeb3().eth.defaultAccount
    if (!account) {
        return <p>Account not yet loaded</p>
    }

    let lotteryTickets = lottery.tickets[account]
    if (!lotteryTickets) {
        return <p>No Lottery tickets for your address.</p>
    }

    let userTickets = Object.keys(lotteryTickets)
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Ticket Number</th>
                </tr>
            </thead>

            <tbody>
                {userTickets.map((ticket, index) => (
                    <LotteryListItem
                        key={ticket}
                        index={index}
                        ticket={ticket}
                    />
                ))}
            </tbody>
        </table>
    )
}
