import HouseLotteryContractJson from '../../../build/contracts/HouseLotteryController.json'
import ThorifyContract from './ThorifyContract'

export default class HouseLotteryContract extends ThorifyContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseLotteryContractJson)
    }

    lotteries(session) {
        return this.contract.methods.lotteries(session).call()
    }

    lotteryTicketHolders(session, ticketNumber) {
        return this.contract.methods.lotteryTicketHolders(session, ticketNumber).call()
    }

    lotteryUserTickets(session, address, index) {
        return this.contract.methods.lotteryUserTickets(session, address, index).call()
    }
}