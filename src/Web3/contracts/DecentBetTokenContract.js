import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import BaseContract from './BaseContract'

const keyHandler = new KeyHandler()

export default class DecentBetTokenContract extends BaseContract {

    /** Getters */
    allowance(owner, spender) {
        return this.instance.methods
            .allowance(owner, spender)
            .call()
    }

    balanceOf(address) {
        return this.getBalance(address)
    }

    /** Setters */
    approve = (address, value) => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
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

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    faucet() {
        console.log('Sending faucet tx')
        return this.instance.methods
            .faucet()
            .send({ from: this.web3.eth.defaultAccount })
    }

    /**
     * Events
     * */
    logTransfer(address, isFrom, fromBlock, toBlock) {
        if (fromBlock === undefined) {
            fromBlock = false
        }
        if (toBlock === undefined) {
            toBlock = false
        }
        let options = {}
        options[isFrom ? 'from' : 'to'] = address

        return this.instance.events.Transfer({
            filter: options,
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })

    }
}
