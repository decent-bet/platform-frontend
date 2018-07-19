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
        return this.instance.authorizedAddresses(index)
    }

    addToAuthorizedAddresses (address) {
        return this.instance.addToAuthorizedAddresses(address)
    }

    removeFromAuthorizedAddresses(address) {
        return this.instance.removeFromAuthorizedAddresses(address)
    }
}