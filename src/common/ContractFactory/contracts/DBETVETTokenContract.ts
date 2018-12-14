import BaseContract from './BaseContract'
export default class DBETVETTokenContract extends BaseContract<any> {
    /** Getters */
    public async allowance(owner: string, spender: string) {
        return await this.instance.methods.allowance(owner, spender).call()
    }

    public async balanceOf(address) {
        return await this.instance.methods.balanceOf(address).call()
    }

    /** Setters */
    public async approve(address, value) {
        const encodedFunctionCall = this.instance.methods
            .approve(address, value)
            .encodeABI()
        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    public async faucet() {
        try {
            const encodedFunctionCall: string = this.instance.methods
                // @ts-ignore
                .faucet()
                .encodeABI()

            return new Promise(async resolve => {
                let tx = await this.signAndSendRawTransaction(
                    this.instance.options.address,
                    null,
                    null,
                    encodedFunctionCall
                )
                resolve(tx)
            })
        } catch (error) {
            console.log('Request failed', error)
            throw error
        }
    }

    /**
     * Events
     * */
    public async logTransfer(address, isFrom) {
        let filter = {}
        filter[isFrom ? 'from' : 'to'] = address

        let settings = {
            filter,
            fromBlock: 'latest',
            toBlock: 'latest',
            order: 'DESC',
            options: { offset: 0, limit: 1 }
        }

        return await this.getPastEvents('Transfer', settings)
    }

    public async logApproval(spender, value, fromBlock, toBlock) {
        let filter = {
            owner: await this._keyHandler.getPublicAddress(),
            spender: undefined,
            value: undefined
        }
        if (spender) filter.spender = spender
        if (value) filter.value = value

        // @ts-ignore
        return this.getEvents(
            'Approval',
            filter,
            fromBlock ? fromBlock : 'latest',
            toBlock ? toBlock : 'latest'
        )
    }
}
