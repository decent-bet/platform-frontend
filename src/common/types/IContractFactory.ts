export default interface IContractFactory {
    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} contractName
     * @returns {Promise<any>}
     */
    makeContract(contractName: string): Promise<any>

    /**
     * @returns {SlotsChannelFinalizerContract}
     */
    slotsChannelFinalizerContract(): Promise<any>
    /**
     * @returns {SlotsChannelManagerContract}
     */
    slotsChannelManagerContract(): Promise<any>

    /**
     * @returns {DecentBetTokenContract}
     */
    decentBetTokenContract(): Promise<any>
}
