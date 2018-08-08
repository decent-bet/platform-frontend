import BaseContract from './BaseContract'

export default class HouseLotteryContract extends BaseContract {
    
    async lotteries(session) {
        return await this.instance.methods.lotteries(session).call()
    }

    async lotteryTicketHolders(session, ticketNumber) {
        return await this.instance.methods
            .lotteryTicketHolders(session, ticketNumber)
            .call()
    }

    async lotteryUserTickets(session, address, index) {
        return await this.instance.methods
            .lotteryUserTickets(session, address, index)
            .call()
    }
}
