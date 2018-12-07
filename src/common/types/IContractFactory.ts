import SlotsChannelFinalizerContract from '../ContractFactory/contracts/SlotsChannelFinalizerContract'
import SlotsChannelManagerContract from '../ContractFactory/contracts/SlotsChannelManagerContract'
import DBETVETTokenContract from '../ContractFactory/contracts/DBETVETTokenContract'

export default interface IContractFactory<T> {
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<any>}
     */
    makeContract(contractName: string, publicAddress?: string): Promise<T>

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
