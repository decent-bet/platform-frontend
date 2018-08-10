
import BaseContract from './BaseContract'

export default class DecentBetTokenContract extends BaseContract {
    /** Getters */
    async allowance (owner, spender) {
        return await this.instance.methods.allowance(owner, spender).call()
    }

    async balanceOf(address) {
        return await this.getBalance(address)
    }

    /** Setters */
    async approve (address, value) {
        let encodedFunctionCall = this.web3.eth.abi.encodeFunctionCall(
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

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async faucet() {
        
        let encodedFunctionCall = this.web3.eth.abi.encodeFunctionCall(
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
}
