import BaseContract from './BaseContract'

export default class HouseLotteryContract extends BaseContract {
    lotteries(session) {
        return this.instance.methods.lotteries(session).call()
    }

    lotteryTicketHolders(session, ticketNumber) {
        return this.instance.methods
            .lotteryTicketHolders(session, ticketNumber)
            .call()
    }

    lotteryUserTickets(session, address, index) {
        return this.instance.methods
            .lotteryUserTickets(session, address, index)
            .call()
    }
}
