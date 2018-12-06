import { Contracts } from './contracts'
import Web3, { Contract } from 'web3'
import migrationContracts from '@decent-bet/contract-migration'
import contracts from '@decent-bet/contract-slots'
import BaseContract from './contracts/BaseContract'
import SlotsChannelFinalizerContract from './contracts/SlotsChannelFinalizerContract'
import SlotsChannelManagerContract from './contracts/SlotsChannelManagerContract'
import DBETVETTokenContract from './contracts/DBETVETTokenContract'
import { IThorifyFactory, IKeyHandler } from '../types'

export default class ContractFactory {
    private _jsonContracts = {
        DBETVETToken: migrationContracts.DBETVETToken,
        SlotsChannelManager: contracts.SlotsChannelManager,
        SlotsChannelFinalizer: contracts.SlotsChannelFinalizer
    }

    private _slotsChannelManagerContract?: SlotsChannelManagerContract
    private _slotsChannelFinalizerContract?: SlotsChannelFinalizerContract
    private _dbetVETTokenContract?: DBETVETTokenContract
    private _thorify: Web3

    /**
     *
     * @param {ThorifyFactory} thorifyFactory
     */
    constructor(
        private _thorifyFactory: IThorifyFactory,
        private _keyHandler: IKeyHandler
    ) {}
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<BaseContract>}
     */
    public async makeContract<T extends BaseContract<Contract>>(
        contractName: string
    ): Promise<T> {
        if (!this._thorify) {
            this._thorify = await this._thorifyFactory.configured()
        }

        const contract = this._jsonContracts[contractName]
        const instance = new this._thorify.eth.Contract(contract.raw.abi)
        const chainTag = await this._thorify.eth.getChainTag()
        let contractAddress = contract.address[chainTag]

        instance.options.address = contractAddress
        const contractItem = new Contracts[`${contractName}Contract`](
            this._thorify,
            instance,
            this._keyHandler
        )

        return contractItem
    }

    /**
     * @returns {SlotsChannelFinalizer}
     */
    public async slotsChannelFinalizerContract(): Promise<
        SlotsChannelFinalizerContract
    > {
        const result = this._slotsChannelFinalizerContract
        if (result) return result

        // Build a new instance if there is no one cached
        const contract = await this.makeContract<SlotsChannelFinalizerContract>(
            'SlotsChannelFinalizer'
        )
        this._slotsChannelFinalizerContract = contract
        return contract
    }

    /**
     * @returns {SlotsChannelManager}
     */
    public async slotsChannelManagerContract(): Promise<
        SlotsChannelManagerContract
    > {
        const result = this._slotsChannelManagerContract
        if (result) return result

        // Build a new instance if there is no one cached
        const contract = await this.makeContract<SlotsChannelManagerContract>(
            'SlotsChannelManager'
        )
        this._slotsChannelManagerContract = contract
        return contract
    }

    /**
     * @returns {DBETVETToken}
     */
    public async decentBetTokenContract(): Promise<DBETVETTokenContract> {
        const result = this._dbetVETTokenContract
        if (result) return result

        // Build a new instance if there is no one cached
        const contract = await this.makeContract<DBETVETTokenContract>(
            'DBETVETToken'
        )
        this._dbetVETTokenContract = contract
        return contract
    }
}
