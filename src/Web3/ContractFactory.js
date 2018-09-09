import { JsonContracts } from './JsonContracts'
import { Contracts } from './contracts'

export class ContractFactory {
    _contracts = new Map()

    /**
     *
     * @param {Web3} web3
     */
    constructor(web3, keyHandler) {
        this._web3 = web3
        this._keyHandler = keyHandler
    }
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     */
    async makeContract(contractName, jsonName) {

        if (!JsonContracts.hasOwnProperty(contractName)) {
            throw new Error(`Json contract doesn't exists for the name given: ${contractName}`)
        }

        if (!Contracts.hasOwnProperty(contractName)) {
            throw new Error(`Contract class doesn't exists for the name given: ${contractName}`)
        }

        //get the contract if exists in the map
        let contractItem = this._contracts.get(contractName)

        if(typeof contractItem === 'undefined') {
            const contract = JsonContracts[contractName]
            const instance = new this._web3.eth.Contract(contract.raw.abi)
            const chainTag = await this._web3.eth.getChainTag()
            const contractAddress = contract.address[chainTag]
            instance.options.address = contractAddress
            contractItem = new Contracts[contractName](this._web3, instance, this._keyHandler)
            this._contracts.set(contractName, contractItem)
        }

        return contractItem
    }

    /**
     * @returns {SlotsChannelFinalizerContract}
    */
   async slotsChannelFinalizerContract() {
    return await this.makeContract('SlotsChannelFinalizerContract', 'SlotsChannelFinalizer')
    }

    /**
     * @returns {SlotsChannelManagerContract}
    */
   async slotsChannelManagerContract() {
    return await this.makeContract('SlotsChannelManagerContract', 'SlotsChannelManager')
    }

    /**
     * @returns {DecentBetTokenContract}
    */
   async decentBetTokenContract() {
        return await this.makeContract('DecentBetTokenContract', 'TestDecentBetToken')
    }

}
