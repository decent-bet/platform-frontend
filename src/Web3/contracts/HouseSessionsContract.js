import HouseSessioinContractJson from '../../../build/contracts/HouseSessionsController.json'
import AbstractContract from './AbstractContract'
export default class HouseSessioinContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseSessioinContractJson)
    }

    // Mapping (uint => Session)
    getSession(sessionNumber) {
        return this.instance.sessions(sessionNumber)
    }
}