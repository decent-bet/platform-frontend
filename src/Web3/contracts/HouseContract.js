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
        return this.instance.currentSession()
    }

    /**
     * Setters
     */
    purchaseCredits(amount) {
        return this.instance.purchaseCredits.sendTransaction(
            amount, {
                from: this.web3.eth.defaultAccount,
                gas: 5000000
            }
        )
    }
    
    /**
     * Events
     */
    logPurchasedCredits(sessionNumber, fromBlock, toBlock) {
        return this.instance.LogPurchasedCredits({
            creditHolder: this.web3.eth.defaultAccount,
            session: sessionNumber
        }, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logLiquidateCredits(sessionNumber, fromBlock, toBlock) {
        return this.instance.LogLiquidateCredits({
            creditHolder: this.web3.eth.defaultAccount,
            session: sessionNumber
        }, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}