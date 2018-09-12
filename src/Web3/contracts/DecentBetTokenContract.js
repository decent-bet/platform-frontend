
import BaseContract from './BaseContract'

export default class DecentBetTokenContract extends BaseContract {
    /** Getters */
    async allowance (owner, spender) {
        return await this.instance.methods.allowance(owner, spender).call()
    }

    async balanceOf(address) {
        console.log('get tokens', address);
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
        try {
            const encodedFunctionCall = this.instance.methods.faucet().encodeABI()
            
            return new Promise((resolve) => {
                setTimeout( async()=>{
                    let tx = await this.signAndSendRawTransaction(
                        this.instance.options.address,
                        null,
                        null,
                        encodedFunctionCall)
                        resolve(tx)
                }, 10000)
            })

        }catch(error) {
            console.log('Request failed', error);
            throw error
        }
    }

    /**
     * Events
     * */
    async logTransfer(address, isFrom) {

        let filter = {}
        filter[isFrom ? 'from' : 'to'] = address
        
        let settings = { filter: filter,
          fromBlock:'latest',
          toBlock:'latest',
            order: 'DESC', 
            options: { offset: 0, limit: 1 } }

        return await this.getPastEvents('Transfer', settings)
    }

    async logApproval(spender, value, fromBlock, toBlock) {
        let filter = {
            owner: this._keyHandler.getAddress()
        }
        if(spender)
            filter.spender = spender
        if(value)
            filter.value = value

        return this.getEvents('Approval', filter, (fromBlock ? fromBlock : 'latest'), (toBlock ? toBlock : 'latest'))
    }
}
