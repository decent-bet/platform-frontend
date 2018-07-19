export default class HouseController {

    /**
     * @param {Web3} web3
     * @param {HouseContract} houseContract
     * @param {HouseSessionsContract} houseSessionsContract
     * @param {HouseFundsContract} houseFundsContract
     * @param {HouseAuthorizedContract} houseAuthorizedContract
     * @param {HouseLotteryContract} houseConhouseLotteryContracttract
     */
    constructor(web3,
        houseContract,
        houseSessionsContract,
        houseFundsContract,
        houseAuthorizedContract,
        houseLotteryContract) {

        this.web3 = web3
        this.houseContract = houseContract
        this.houseSessionsContract = houseSessionsContract
        this.houseFundsContract = houseFundsContract
        this.houseAuthorizedContract = houseAuthorizedContract
        this.houseLotteryContract = houseLotteryContract
    }

    /**
     * Getters
     */
    getCurrentSession() {
        return this.houseContract.getCurrentSession()
    }

    // Mapping (uint => Session)
    getSession(sessionNumber) {
        return this.houseSessionsContract.sessions(sessionNumber)
    }

    getHouseFunds(sessionNumber) {
        return this.houseFundsContract.getHouseFunds(sessionNumber)
    }

    getUserCreditsForSession(sessionNumber, address) {
        return this.houseFundsContract.getUserCreditsForSession.call(
            sessionNumber,
            address, {
                from: this.web3.eth.defaultAccount
            }
        )
    }

    getAuthorizedAddresses(index) {
        return this.houseAuthorizedContract.authorizedAddresses(index)
    }

    addToAuthorizedAddresses(address) {
        return this.houseAuthorizedContract.addToAuthorizedAddresses(address)
    }

    removeFromAuthorizedAddresses(address) {
        return this.houseAuthorizedContract.removeFromAuthorizedAddresses(address)
    }

    lotteries(session) {
        return this.houseLotteryContract.lotteries(session)
    }

    lotteryTicketHolders(session, ticketNumber) {
        return this.houseLotteryContract.lotteryTicketHolders(session, ticketNumber)
    }

    lotteryUserTickets(session, address, index) {
        return this.houseLotteryContract.lotteryUserTickets(session, address, index)
    }

    /**
     * Setters
     */
    purchaseCredits(amount) {
        return this.houseContract.purchaseCredits.sendTransaction(
            amount, {
                from: this.web3.eth.defaultAccount,
                gas: 5000000
            }
        )
    }

    /**
     * Events
     */
    logPurchasedCredits(sessionNumber, fromBlock, toBlock) {
        return this.houseContract.logPurchasedCredits({
            creditHolder: this.web3.eth.defaultAccount,
            session: sessionNumber
        }, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logLiquidateCredits(sessionNumber, fromBlock, toBlock) {
        return this.houseContract.logLiquidateCredits({
            creditHolder: this.web3.eth.defaultAccount,
            session: sessionNumber
        }, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}