import { Contracts } from './contracts'
import { Contract } from 'web3'
import migrationContracts from '@decent-bet/contract-migration'
import contracts from '@decent-bet/contract-slots'
import BaseContract from './contracts/BaseContract'
import SlotsChannelFinalizerContract from './contracts/SlotsChannelFinalizerContract'
import SlotsChannelManagerContract from './contracts/SlotsChannelManagerContract'
import DBETVETTokenContract from './contracts/DBETVETTokenContract'
import { IThorifyFactory, IKeyHandler, IContractFactory } from '../types'

export default class ContractFactory implements IContractFactory {
    private _jsonContracts = {
        DBETVETToken: migrationContracts.DBETVETToken,
        SlotsChannelManager: contracts.SlotsChannelManager,
        SlotsChannelFinalizer: contracts.SlotsChannelFinalizer
    }

    private _slotsChannelManagerContract?: SlotsChannelManagerContract
    private _slotsChannelFinalizerContract?: SlotsChannelFinalizerContract
    private _dbetVETTokenContract?: DBETVETTokenContract

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
        contractName: string,
        publicAddress?: string
    ): Promise<T> {
        const thorify = await this._thorifyFactory.make(publicAddress)

        const contract = this._jsonContracts[contractName]
        const instance = new thorify.eth.Contract(contract.raw.abi)
        const chainTag = await thorify.eth.getChainTag()
        let contractAddress = contract.address[chainTag]

        instance.options.address = contractAddress
        const contractItem = new Contracts[`${contractName}Contract`](
            thorify,
            instance,
            this._keyHandler
        )

        return contractItem
    }

    /**
     * @returns {SlotsChannelFinalizer}
     */
    public async slotsChannelFinalizerContract(
        publicAddress?: string
    ): Promise<SlotsChannelFinalizerContract> {
        const result = this._slotsChannelFinalizerContract
        if (result) return result

        // Build a new instance if there is no one cached
        const contract = await this.makeContract<SlotsChannelFinalizerContract>(
            'SlotsChannelFinalizer',
            publicAddress
        )
        this._slotsChannelFinalizerContract = contract
        return contract
    }

    /**
     * @returns {SlotsChannelManager}
     */
    public async slotsChannelManagerContract(
        publicAddress?: string
    ): Promise<SlotsChannelManagerContract> {
        const result = this._slotsChannelManagerContract
        if (result) return result

        // Build a new instance if there is no one cached
        const contract = await this.makeContract<SlotsChannelManagerContract>(
            'SlotsChannelManager',
            publicAddress
        )
        this._slotsChannelManagerContract = contract
        return contract
    }

    /**
     * @returns {DBETVETToken}
     */
    public async decentBetTokenContract(
        publicAddress?: string
    ): Promise<DBETVETTokenContract> {
        const result = this._dbetVETTokenContract
        if (result) return result

        // Build a new instance if there is no one cached
        const contract = await this.makeContract<DBETVETTokenContract>(
            'DBETVETToken',
            publicAddress
        )
        this._dbetVETTokenContract = contract
        return contract
    }
}
