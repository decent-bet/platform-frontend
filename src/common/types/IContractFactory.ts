export default interface IContractFactory {
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<any>}
     */
    makeContract(contractName: string, publicAddress?: string): Promise<any>

    /**
     * @returns {SlotsChannelFinalizerContract}
     */
    slotsChannelFinalizerContract(publicAddress?: string): Promise<any>
    /**
     * @returns {SlotsChannelManagerContract}
     */
    slotsChannelManagerContract(publicAddress?: string): Promise<any>

    /**
     * @returns {DecentBetTokenContract}
     */
    decentBetTokenContract(publicAddress?: string): Promise<any>
}
