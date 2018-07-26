import HouseContractJson from '../../../build/contracts/House.json'
import AbstractContract from './AbstractContract'

export default class HouseContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, HouseContractJson)
    }
    /**
     * Getters
     */
    getCurrentSession() {
        return this.contract.methods.currentSession().call()
    }

    /**
     * Setters
     */
    purchaseCredits(amount) {
        return this.contract.methods.purchaseCredits(
            amount
        ).send({
            from: this.web3.eth.defaultAccount,
            gas: 5000000
        })
    }
    
    /**
     * Events
     */
    logPurchasedCredits(sessionNumber, fromBlock, toBlock) {

        let options = {
            filter: {
                creditHolder: this.web3.eth.defaultAccount,
                session: sessionNumber
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        }

        return this.contract.events.LogPurchasedCredits(options)
    }

    logLiquidateCredits(sessionNumber, fromBlock, toBlock) {

        let options = {
            filter: {
                creditHolder: this.web3.eth.defaultAccount,
                session: sessionNumber
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        }

        return this.contract.events.LogLiquidateCredits(options)
    }
}