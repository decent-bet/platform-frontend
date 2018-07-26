import HouseSessionsContractJson from '../../../build/contracts/HouseSessionsController.json'
import ThorifyContract from './ThorifyContract'

export default class HouseSessionsContract extends ThorifyContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseSessionsContractJson)
    }

    // Mapping (uint => Session)
    getSession(sessionNumber) {
        return this.contract.methods.sessions(sessionNumber).call()
    }
}