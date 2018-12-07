import SlotsChannelFinalizerContract from '../ContractFactory/contracts/SlotsChannelFinalizerContract'
import SlotsChannelManagerContract from '../ContractFactory/contracts/SlotsChannelManagerContract'
import DBETVETTokenContract from '../ContractFactory/contracts/DBETVETTokenContract'
import BaseContract from '../ContractFactory/contracts/BaseContract'
import { Contract } from 'web3'

export default interface IContractFactory {
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<any>}
     */
    makeContract<T extends BaseContract<Contract>>(
        contractName: string,
        publicAddress?: string
    ): Promise<T>

    /**
     * @returns {SlotsChannelFinalizerContract}
     */
    slotsChannelFinalizerContract(
        publicAddress?: string
    ): Promise<SlotsChannelFinalizerContract>
    /**
     * @returns {SlotsChannelManagerContract}
     */
    slotsChannelManagerContract(
        publicAddress?: string
    ): Promise<SlotsChannelManagerContract>

    /**
     * @returns {DBETVETTokenContract}
     */
    decentBetTokenContract(
        publicAddress?: string
    ): Promise<DBETVETTokenContract>
}
