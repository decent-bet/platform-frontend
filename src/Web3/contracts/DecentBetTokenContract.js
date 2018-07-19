import DecentBetTokenJson from '../../../build/contracts/TestDecentBetToken.json'
import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import AbstractContract from './AbstractContract'

const keyHandler = new KeyHandler()

export default class DecentBetTokenContract extends AbstractContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, DecentBetTokenJson)
    }

    /** Getters */
    allowance = (owner, spender) => {
        return this.instance.allowance.call(
            owner,
            spender, {
                from: this.web3.eth.defaultAccount
            }
        )
    }

    balanceOf = address => {
        return this.instance.balanceOf.call(address, {
            from: this.web3.eth.defaultAccount
        })
    }

    /** Setters */
    approve = (address, value) => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'approve',
            type: 'function',
            inputs: [{
                    name: 'spender',
                    type: 'address'
                },
                {
                    name: 'value',
                    type: 'uint256'
                }
            ]
        }, [address, value])

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    faucet = () => {
        console.log('Sending faucet tx')

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'faucet',
            type: 'function',
            inputs: []
        }, [])

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    /**
     * Events
     * */
    logTransfer = (address, isFrom, fromBlock, toBlock) => {
        let options = {}
        options[isFrom ? 'from' : 'to'] = address

        return this.instance.Transfer(options, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
}