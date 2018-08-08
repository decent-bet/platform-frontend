import BaseContract from './BaseContract'

export default class HouseFundsContract extends BaseContract {

    async getHouseFunds(sessionNumber) {
        return await this.instance.methods.houseFunds(sessionNumber).call()
    }

    async getUserCreditsForSession(sessionNumber, address) {
        return await this.instance.methods.getUserCreditsForSession(
            sessionNumber,
            address).call({
                from: this.web3.eth.defaultAccount
            })
    }
}