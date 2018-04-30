import SlotsChannelManagerJson from '../../build/contracts/SlotsChannelManager.json'
import Contract from 'truffle-contract'
import KeyHandler from './KeyHandler'
import NonceHandler from './NonceHandler'
import ethAbi from 'web3-eth-abi'
import EthAccounts from 'web3-eth-accounts'
import Helper from '../Components/Helper'

// Used for VSCode Type Checking
import Web3 from 'web3' // eslint-disable-line no-unused-vars

const helper = new Helper()
const keyHandler = new KeyHandler()
const nonceHandler = new NonceHandler()
const ethAccounts = new EthAccounts(helper.getGethProvider())

export default class SlotsChannelManager {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(web3) {
        this.web3 = web3
        this.contract = Contract(SlotsChannelManagerJson)
        this.contract.setProvider(web3.currentProvider)

        // Dirty hack for web3@1.0.0 support for localhost testrpc,
        // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
        if (typeof this.contract.currentProvider.sendAsync !== 'function') {
            this.contract.currentProvider.sendAsync = function() {
                return this.contract.currentProvider.send.apply(
                    this.contract.currentProvider,
                    arguments
                )
            }
        }
    }

    /** Initializes an instance of the contract */
    deployed = async () => {
        return this.contract
            .deployed()
            .then(_instance => (this.instance = _instance))
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
        console.log(
            'Withdraw',
            amount,
            'from slots channel manager as',
            this.web3.eth.defaultAccount
        )

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
        console.log('logChannelActivate', this.web3.eth.defaultAccount)
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

    signAndSendRawTransaction = async (
        privateKey,
        to,
        gasPrice = 10000000000,
        gas,
        data
    ) => {
        const from = this.web3.eth.defaultAccount
        const count = await this.web3.eth.getTransactionCount(from, 'latest')

        const nonce = nonceHandler.get(count)
        const tx = {
            from,
            to,
            gas,
            data,
            nonce,
            gasPrice
        }

        const { rawTransaction } = await ethAccounts.signTransaction(
            tx,
            privateKey
        )

        return this.web3.eth
            .sendSignedTransaction(rawTransaction)
            .then(() => nonceHandler.set(nonce))
    }
}
