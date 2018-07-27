import { thorify } from 'thorify'
import Web3 from 'web3'
import KeyHandler from './KeyHandler'
import ContractHelper from './ContractHelper'

const keyHandler = new KeyHandler()

export default class ThorConnection {
    constructor() {
        const thor = thorify(new Web3()) // TODO: Read url from config
        thor.eth.defaultAccount = keyHandler.getAddress().toLowerCase()
        const contractHelper = new ContractHelper(null, thor)
        window.contractHelper = contractHelper
    }

    load() {
        // load contracts
    }

    // get thor
}
