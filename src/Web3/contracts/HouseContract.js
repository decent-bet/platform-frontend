import BaseContract from './BaseContract'

export default class HouseContract extends BaseContract {
    /**
     * Getters
     */
    async getCurrentSession() {
        return await this.instance.methods.currentSession().call()
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
    async logPurchasedCredits(sessionNumber, fromBlock, toBlock) {

        let options = {
            filter: {
                creditHolder: this.web3.eth.defaultAccount,
                session: sessionNumber
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        }

        return await this.getPastEvents('LogPurchasedCredits', options)
    }

    async logLiquidateCredits(sessionNumber, fromBlock, toBlock) {

        let options = {
            filter: {
                creditHolder: this.web3.eth.defaultAccount,
                session: sessionNumber
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        }

        return await this.getPastEvents('LogLiquidateCredits', options)
    }
}