import DecentBetTokenJson from '../../../build/contracts/TestDecentBetToken.json'
import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import ThorifyContract from './ThorifyContract'

const keyHandler = new KeyHandler()

export default class DecentBetTokenContract extends ThorifyContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, DecentBetTokenJson)
    }

    /** Getters */
    allowance(owner, spender) {
        return this.contract.methods
            .allowance(owner, spender)
            .call({ from: this.web3.eth.defaultAccount })
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
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    faucet() {
        console.log('Sending faucet tx')
        return this.contract.methods
            .faucet()
            .send({ from: this.web3.eth.defaultAccount })
    }

    /**
     * Events
     * */
    logTransfer = (address, isFrom, fromBlock, toBlock) => {
        let options = {}
        options[isFrom ? 'from' : 'to'] = address
        const eventOptions = {
            filter: options,
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        }

        // return this.contract.events.Transfer({ filter: options,
        //     fromBlock: fromBlock ? fromBlock : 0,
        //     toBlock: toBlock ? toBlock : 'latest'
        // })
        return this.getEvents('Transfer', eventOptions)
    }
}
