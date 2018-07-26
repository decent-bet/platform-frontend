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
        return this.contract.methods.houseFunds(sessionNumber).call()
    }

    getUserCreditsForSession(sessionNumber, address) {
        return this.contract.methods.getUserCreditsForSession(
            sessionNumber, 
            address).call({
                from: this.web3.eth.defaultAccount
            })
    }
}