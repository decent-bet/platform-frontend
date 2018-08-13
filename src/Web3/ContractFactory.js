
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
    async makeContract(contractName) {
        
        if (!JsonContracts.hasOwnProperty(contractName)) {
            throw new Error(`Json contract doesn't exists for the name given: ${contractName}`)
        }

        if (!Contracts.hasOwnProperty(contractName)) {
            throw new Error(`Contract class doesn't exists for the name given: ${contractName}`)
        }

        //get the contract if exists in the map
        let contractItem = this._contracts.get(contractName)

        if(typeof contractItem === 'undefined') {
            const json = JsonContracts[contractName]
            const instance = new this._web3.eth.Contract(json.abi)
            const chainTagObject = await this.getChainTagObject(json)
            instance.options.address = chainTagObject.address
            contractItem = new Contracts[contractName](this._web3, instance, this._keyHandler)
            this._contracts.set(contractName, contractItem)
        }

        return contractItem
    } 

    async getChainTagObject(json) {
        const chainTag = await this._web3.eth.getChainTag()
        console.log('chainTag', chainTag)
        return json.chain_tags[chainTag]
    }
    /**
     * @returns {Promise<BettingProviderContract>}
     */
    async bettingProviderContract() {
        return await this.makeContract('BettingProviderContract')
    }
    

    /**
     * @returns {HouseAuthorizedContract}
     */
    async houseAuthorizedContract() {
        return await this.makeContract('HouseAuthorizedContract')
    }

    /**
     * @returns {HouseContract}
    */
    async houseContract() {
        return await this.makeContract('HouseContract')
    }

    /**
     * @returns {HouseFundsContract}
    */
   async houseFundsContract() {
        return await this.makeContract('HouseFundsContract')
    }

    /**
     * @returns {HouseLotteryContract}
    */
   async houseLotteryContract() {
        return await this.makeContract('HouseLotteryContract')
    }

    /**
     * @returns {HouseSessionsContract}
    */
   async houseSessionsContract() {
    return await this.makeContract('HouseSessionsContract')
    }

    /**
     * @returns {SlotsChannelFinalizerContract}
    */
   async slotsChannelFinalizerContract() {
    return await this.makeContract('SlotsChannelFinalizerContract')
    }

    /**
     * @returns {SlotsChannelManagerContract}
    */
   async slotsChannelManagerContract() {
    return await this.makeContract('SlotsChannelManagerContract')
    }

    /**
     * @returns {DecentBetTokenContract}
    */
   async decentBetTokenContract() {
        return await this.makeContract('DecentBetTokenContract')
    }

    /**
     * @returns {SportsOracleContract}
    */
   async sportsOracleContract() {
    return await this.makeContract('SportsOracleContract')
    }
    
}