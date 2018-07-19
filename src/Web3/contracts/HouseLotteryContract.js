import HouseLotteryContractJson from '../../../build/contracts/HouseLotteryController.json'
import AbstractContract from './AbstractContract'

export default class HouseLotteryContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseLotteryContractJson)
    }

    lotteries(session) {
        return this.instance.lotteries(session)
    }

    lotteryTicketHolders(session, ticketNumber) {
        return this.instance.lotteryTicketHolders(session, ticketNumber)
    }

    lotteryUserTickets(session, address, index) {
        return this.instance.lotteryUserTickets(session, address, index)
    }
}