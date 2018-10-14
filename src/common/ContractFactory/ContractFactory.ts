import IKeyHandler from 'src/common/helpers/IKeyHandler'
import { Contracts } from './contracts'
import {
    TestDecentBetToken,
    SlotsChannelManager,
    SlotsChannelFinalizer
} from '@decent-bet/contract-slots'

export default class ContractFactory {
    private _jsonContracts = {
        TestDecentBetToken,
        SlotsChannelManager,
        SlotsChannelFinalizer
    }
    private _contracts: Map<string, any>
    private _thorify: any
    /**
     *
     * @param {ThorifyFactory} thorifyFactory
     */
    constructor(
        private _thorifyFactory: any,
        private _keyHandler: IKeyHandler
    ) {
        this._contracts = new Map()
    }
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<any>}
     */
    public async makeContract(contractName: string): Promise<any> {
        if (!Contracts.hasOwnProperty(contractName)) {
            throw new Error(
                `Contract class doesn't exists for the name given: ${contractName}`
            )
        }

        // get the contract if exists in the map
        let contractItem = this._contracts.get(contractName)
        if (!this._thorify) {
            this._thorify = this._thorifyFactory.make()
        }

        if (typeof contractItem === 'undefined') {
            const contract = this._jsonContracts[contractName]
            const instance = new this._thorify.eth.Contract(contract.raw.abi)
            const chainTag = await this._thorify.eth.getChainTag()
            const contractAddress = contract.address[chainTag]
            instance.options.address = contractAddress
            contractItem = new Contracts[contractName](
                this._thorify,
                instance,
                this._keyHandler
            )
            this._contracts.set(contractName, contractItem)
        }

        return contractItem
    }

    /**
     * @returns {SlotsChannelFinalizerContract}
     */
    public async slotsChannelFinalizerContract(): Promise<any> {
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
        return await this.makeContract('DecentBetTokenContract')
    }
}
