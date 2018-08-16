
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
        let encodedFunctionCall = this._web3.eth.abi.encodeFunctionCall(
            {
                name: 'approve',
                type: 'function',
                inputs: [
                    {
                        name: 'spender',
                        type: 'address'
                    },
                    {
                        name: 'value',
                        type: 'uint256'
                    }
                ]
            },
            [address, value]
        )

        console.log('Encoded function call', encodedFunctionCall)

        return this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async faucet() {
        let encodedFunctionCall = this._web3.eth.abi.encodeFunctionCall(
            {
                name: 'faucet',
                type: 'function',
                inputs: []
            },
            []
        )

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
        if (fromBlock === undefined) {
            fromBlock = false
        }
        if (toBlock === undefined) {
            toBlock = false
        }
        let options = {}
        options[isFrom ? 'from' : 'to'] = address

        return await this.getPastEvents('Transfer', {
            filter: options,
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logApproval(spender, value, fromBlock, toBlock) {
        let options = {
            owner: this._web3.eth.defaultAccount
        }
        if(spender)
            options.spender = spender
        if(value)
            options.value = value

        return this.getEvents('Approval', {
            filter: options,
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}
