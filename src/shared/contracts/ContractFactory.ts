import { Contracts } from './contracts'
import { TestDecentBetToken, SlotsChannelManager, SlotsChannelFinalizer } from '@decent-bet/contract-slots'

export class ContractFactory {
    private _jsonContracts = { TestDecentBetToken, SlotsChannelManager, SlotsChannelFinalizer }
    private _contracts = new Map()
    /**
     *
     * @param {Web3} thorify
     */
    constructor(private thorify, private keyHandler) {}
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<any>}
     */
    public async makeContract(contractName): Promise<any> {

        if (!Contracts.hasOwnProperty(contractName)) {
            throw new Error(`Contract class doesn't exists for the name given: ${contractName}`)
        }

        // get the contract if exists in the map
        let contractItem = this._contracts.get(contractName)

        if(typeof contractItem === 'undefined') {
            const contract = this._jsonContracts[contractName]
            const instance = new this.thorify.eth.Contract(contract.raw.abi)
            const chainTag = await this.thorify.eth.getChainTag()
            const contractAddress = contract.address[chainTag]
            instance.options.address = contractAddress
            contractItem = new Contracts[contractName](this.thorify, instance, this.keyHandler)
            this._contracts.set(contractName, contractItem)
        }

        return contractItem
    }

    /**
     * @returns {SlotsChannelFinalizerContract}
    */
   public  async slotsChannelFinalizerContract(): Promise<any> {
    return await this.makeContract('SlotsChannelFinalizer')
  }

    /**
     * @returns {SlotsChannelManagerContract}
    */
   public async slotsChannelManagerContract(): Promise<any> {
    return await this.makeContract('SlotsChannelManager')
    }

    /**
     * @returns {DecentBetTokenContract}
    */
   public async decentBetTokenContract(): Promise<any> {
        return await this.makeContract('TestDecentBetToken')
    }

}
