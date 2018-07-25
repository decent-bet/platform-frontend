import HouseAuthorizedContractJson from '../../../build/contracts/HouseAuthorizedController.json'
import AbstractContract from './AbstractContract'

export default class HouseAuthorizedContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseAuthorizedContractJson)
    }

    getAuthorizedAddresses (index) {
        return this.contract.methods.authorizedAddresses(index).call()
    }

    addToAuthorizedAddresses (address) {
        return this.contract.methods.addToAuthorizedAddresses(address).call()
    }

    removeFromAuthorizedAddresses(address) {
        return this.contract.methods.removeFromAuthorizedAddresses(address).call()
    }
}