import HouseFundsContractJson from '../../../build/contracts/HouseFundsController.json'
import AbstractContract from './AbstractContract'

export default class HouseFundsContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseFundsContractJson)
    }

    getHouseFunds(sessionNumber) {
        return this.instance.houseFunds(sessionNumber)
    }

    getUserCreditsForSession(sessionNumber, address) {
        return this.instance.getUserCreditsForSession.call(
            sessionNumber, 
            address, {
            from: this.web3.eth.defaultAccount
        })
    }
}