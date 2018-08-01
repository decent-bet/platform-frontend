import BaseContract from './BaseContract'

export default class HouseFundsContract extends BaseContract {

    getHouseFunds(sessionNumber) {
        return this.instance.methods.houseFunds(sessionNumber).call()
    }

    getUserCreditsForSession(sessionNumber, address) {
        return this.instance.methods.getUserCreditsForSession(
            sessionNumber,
            address).call({
                from: this.web3.eth.defaultAccount
            })
    }
}