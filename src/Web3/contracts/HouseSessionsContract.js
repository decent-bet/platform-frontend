import HouseSessionsContractJson from '../../../build/contracts/HouseSessionsController.json'
import AbstractContract from './AbstractContract'

export default class HouseSessionsContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseSessionsContractJson)
    }

    // Mapping (uint => Session)
    getSession(sessionNumber) {
        return this.instance.sessions(sessionNumber)
    }
}