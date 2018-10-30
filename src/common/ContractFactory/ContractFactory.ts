import { Contracts } from './contracts'
import { DBETVETToken } from '@decent-bet/contract-migration'
import {
    SlotsChannelManager,
    SlotsChannelFinalizer
} from '@decent-bet/contract-slots'
import { IThorifyFactory, IKeyHandler } from '../types'

export default class ContractFactory {
    private _jsonContracts = {
        DBETVETToken,
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
        private _thorifyFactory: IThorifyFactory,
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
        if (!Contracts.hasOwnProperty(`${contractName}Contract`)) {
            throw new Error(
                `Contract class doesn't exists for the name given: ${contractName}`
            )
        }

        if (!this._thorify) {
            this._thorify = await this._thorifyFactory.configured()
        }

        // get the contract if exists in the map
        let contractItem = this._contracts.get(contractName)

        if (typeof contractItem === 'undefined') {
            const contract = this._jsonContracts[contractName]
            const instance = new this._thorify.eth.Contract(contract.raw.abi)
            const chainTag = await this._thorify.eth.getChainTag()
            const contractAddress = contract.address[chainTag]
            instance.options.address = contractAddress
            contractItem = new Contracts[`${contractName}Contract`](
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
     * @returns {DBETVETTokenContract}
     */
    public async decentBetTokenContract(): Promise<any> {
        return await this.makeContract('DBETVETToken')
    }
}
