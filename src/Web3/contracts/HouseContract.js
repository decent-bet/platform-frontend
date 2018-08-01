import BaseContract from './BaseContract'

export default class HouseContract extends BaseContract {
    /**
     * Getters
     */
    getCurrentSession() {
        return this.instance.methods.currentSession().call()
    }

    /**
     * Setters
     */
    purchaseCredits(amount) {
        return this.instance.methods.purchaseCredits(
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

        return this.instance.events.LogPurchasedCredits(options)
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

        return this.instance.events.LogLiquidateCredits(options)
    }
}