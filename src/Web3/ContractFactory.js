
import { JsonContracts } from './JsonContracts'
import { Contracts } from './contracts'


export class ContractFactory {
    _contracts = new Map()

    /**
     *
     * @param {Web3} web3
     */
    constructor(web3) {
        this._web3 = web3
    }

    /**
     * Creates a contract wrapper based on the passed name
     * @param {string} name 
     */
    async makeContract(name) {
        
        if (!JsonContracts.hasOwnProperty(name)) {
            throw new Error(`Json contract doesn't exists for the name given: ${name}`)
        }

        if (!Contracts.hasOwnProperty(name)) {
            throw new Error(`Contract class doesn't exists for the name given: ${name}`)
        }

        const nameUpperCased = name.toUpperCase()
        let contractItem = this._contracts.get(nameUpperCased)

        if(typeof contractItem === 'undefined') {
            const json = JsonContracts[name]
            const instance = new this._web3.eth.Contract(json.abi)
            const chainTagObject = await this.getChainTagObject(json)
            instance.options.address = chainTagObject.address
            contractItem = new Contracts[name](this._web3, instance)
            this._contracts.set(nameUpperCased, contractItem)
        }

        return contractItem
    } 

    async getChainTagObject(json) {
        const chainTag = await this._web3.eth.getChainTag()
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