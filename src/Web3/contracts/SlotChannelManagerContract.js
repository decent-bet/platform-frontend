import SlotsChannelManagerJson from '../../../build/contracts/SlotsChannelManager.json'
import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import AbstractContract from './AbstractContract'

// Used for VSCode Type Checking
import Web3 from 'web3' // eslint-disable-line no-unused-vars

const keyHandler = new KeyHandler()

export default class SlotsChannelManager extends AbstractContract{
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        super(web3, SlotsChannelManagerJson)
    }

    /**
     * Getters
     */
    getChannelInfo = id => {
        return this.instance.getChannelInfo.call(id, {
            from: this.web3.eth.defaultAccount
        })
    }

    getChannelHashes = id => {
        return this.instance.getChannelHashes.call(id, {
            from: this.web3.eth.defaultAccount
        })
    }

    checkSig = (id, msgHash, sign, turn) => {
        return this.instance.checkSig.call(id, msgHash, sign, turn, {
            from: this.web3.eth.defaultAccount
        })
    }

    balanceOf = (address, session) => {
        return this.instance.balanceOf.call(address, session, {
            from: this.web3.eth.defaultAccount
        })
    }

    currentSession = () => {
        return this.instance.currentSession.call({
            from: this.web3.eth.defaultAccount
        })
    }

    getPlayer = (id, isHouse) => {
        return this.instance.getPlayer.call(id, isHouse, {
            from: this.web3.eth.defaultAccount
        })
    }

    isChannelClosed = id => {
        return this.instance.isChannelClosed.call(id, {
            from: this.web3.eth.defaultAccount
        })
    }

    finalBalances = (id, isHouse) => {
        return this.instance.finalBalances.call(id, isHouse, {
            from: this.web3.eth.defaultAccount
        })
    }

    /**
     * Setters
     */
    createChannel = deposit => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
                name: 'createChannel',
                type: 'function',
                inputs: [
                    {
                        name: 'initialDeposit',
                        type: 'uint256'
                    }
                ]
            },
            [deposit]
        )

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    deposit = amount => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
                name: 'deposit',
                type: 'function',
                inputs: [
                    {
                        name: 'amount',
                        type: 'uint256'
                    }
                ]
            },
            [amount]
        )

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    withdraw = (amount, session) => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
                name: 'withdraw',
                type: 'function',
                inputs: [
                    {
                        name: 'amount',
                        type: 'uint256'
                    },
                    {
                        name: 'session',
                        type: 'uint256'
                    }
                ]
            },
            [amount, session]
        )

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    depositToChannel = (id, initialUserNumber, finalUserHash) => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
                name: 'depositChannel',
                type: 'function',
                inputs: [
                    {
                        name: 'id',
                        type: 'bytes32'
                    },
                    {
                        name: '_initialUserNumber',
                        type: 'string'
                    },
                    {
                        name: '_finalUserHash',
                        type: 'string'
                    }
                ]
            },
            [id, initialUserNumber, finalUserHash]
        )

        return this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    claim = id => {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
                name: 'claim',
                type: 'function',
                inputs: [
                    {
                        name: 'id',
                        type: 'bytes32'
                    }
                ]
            },
            [id]
        )

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
     */
    logNewChannel = (fromBlock, toBlock) => {
        return this.instance.LogNewChannel(
            {
                user: this.web3.eth.defaultAccount
            },
            {
                fromBlock: fromBlock ? fromBlock : 0,
                toBlock: toBlock ? toBlock : 'latest'
            }
        )
    }
    logChannelDeposit = (id, fromBlock, toBlock) => {
        return this.instance.LogChannelDeposit(
            {
                user: this.web3.eth.defaultAccount,
                id: id
            },
            {
                fromBlock: fromBlock ? fromBlock : 0,
                toBlock: toBlock ? toBlock : 'latest'
            }
        )
    }
    logChannelActivate = (id, fromBlock, toBlock) => {
        return this.instance.LogChannelActivate(
            {
                user: this.web3.eth.defaultAccount,
                id: id
            },
            {
                fromBlock: fromBlock ? fromBlock : 0,
                toBlock: toBlock ? toBlock : 'latest'
            }
        )
    }

    logChannelFinalized = (id, fromBlock, toBlock) => {
        return this.instance.LogChannelFinalized(
            {
                id: id
            },
            {
                fromBlock: fromBlock ? fromBlock : 0,
                toBlock: toBlock ? toBlock : 'latest'
            }
        )
    }

    logClaimChannelTokens = (id, fromBlock, toBlock) => {
        const filter = id ? { id: id } : {}
        return this.instance.LogClaimChannelTokens(filter, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logDeposit = (fromBlock, toBlock) => {
        return this.instance.LogDeposit(
            {
                _address: this.web3.eth.defaultAccount
            },
            {
                fromBlock: fromBlock ? fromBlock : 0,
                toBlock: toBlock ? toBlock : 'latest'
            }
        )
    }
    logWithdraw = (fromBlock, toBlock) => {
        return this.instance.LogWithdraw(
            {
                _address: this.web3.eth.defaultAccount
            },
            {
                fromBlock: fromBlock ? fromBlock : 0,
                toBlock: toBlock ? toBlock : 'latest'
            }
        )
    }

    /**
     * Event Decoders
     */

    logNewChannelDecode = (log, topics) => {
        const params = [
            {
                indexed: false,
                name: 'id',
                type: 'bytes32'
            },
            {
                indexed: true,
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                name: 'initialDeposit',
                type: 'uint256'
            },
            {
                indexed: false,
                name: 'timestamp',
                type: 'uint256'
            }
        ]
        return ethAbi.decodeLog(params, log, topics)
    }
}
