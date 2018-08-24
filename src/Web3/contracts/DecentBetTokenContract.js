
import BaseContract from './BaseContract'

export default class DecentBetTokenContract extends BaseContract {
    /** Getters */
    async allowance (owner, spender) {
        return await this.instance.methods.allowance(owner, spender).call()
    }

    async balanceOf(address) {
        return await this.instance.methods.balanceOf(address).call()
    }

    /** Setters */
    async approve (address, value) {
        const encodedFunctionCall = this.instance.methods.approve(address, value).encodeABI()
        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async faucet() {
        const encodedFunctionCall = this.instance.methods.faucet().encodeABI()
        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall)
    }

    /**
     * Events
     * */
    async logTransfer(address, isFrom, fromBlock, toBlock) {

        let filter = {}
        filter[isFrom ? 'from' : 'to'] = address

        return await this.getPastEvents('Transfer', filter, (fromBlock ? fromBlock : 'latest'), (toBlock ? toBlock : 'latest'))
    }

    async logApproval(spender, value, fromBlock, toBlock) {
        let filter = {
            owner: this._web3.eth.defaultAccount
        }
        if(spender)
            filter.spender = spender
        if(value)
            filter.value = value

        return this.getEvents('Approval', filter, (fromBlock ? fromBlock : 'latest'), (toBlock ? toBlock : 'latest'))
    }
}
