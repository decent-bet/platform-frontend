import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import Bluebird from 'bluebird'
import BaseContract from './BaseContract'

const keyHandler = new KeyHandler()

export default class SlotsChannelManagerContract extends BaseContract {

    /**
     * Getters
     */
    getChannelInfo(id) {
        return this.instance.methods.getChannelInfo(id).call({
            from: this.web3.eth.defaultAccount
        })
    }

    getChannelHashes(id) {
        return this.instance.methods.getChannelHashes(id).call({
            from: this.web3.eth.defaultAccount
        })
    }

    checkSig = (id, msgHash, sign, turn) => {
        return this.instance.methods.checkSig(id, msgHash, sign, turn).call({
            from: this.web3.eth.defaultAccount
        })
    }

    balanceOf(address, session) {
        return this.instance.methods.balanceOf(address, session).call()
    }

    currentSession() {
        const a = this.instance.methods.currentSession().call()
        a.then(a => {
            console.log(a)
        }, console.log)
        return a
    }

    getPlayer(id, isHouse) {
        return this.instance.methods.getPlayer(id, isHouse).call()
    }

    isChannelClosed(id) {
        return this.instance.methods.isChannelClosed(id).call()
    }

    finalBalances(id, isHouse) {
        return this.instance.methods.finalBalances(id, isHouse).call()
    }

    channelDeposits(id, isHouse) {
        return this.instance.methods.channelDeposits(id, isHouse).call()
    }

    async getChannelCount() {
        let count = await this.instance.methods.channelCount().call()
        try {
            return parseInt(count)
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    getChannels() {
        return Bluebird.fromCallback(cb =>
            this.instance.getPastEvents('LogNewChannel', {
                filter: {
                    user: this.web3.eth.defaultAccount
                },
                fromBlock: 0,
                toBlock: 'latest'
            }, cb)
        )
    }

    /**
     * Setters
     */
    createChannel(deposit) {
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
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    deposit(amount) {
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
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    withdraw(amount, session) {
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
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    depositToChannel(id, initialUserNumber, finalUserHash) {
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
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    claim(id) {
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
            this.instance.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    /**
     * Events
     */
    logNewChannel(fromBlock, toBlock) {
        return this.instance.events.LogNewChannel({
            filter: {
                user: this.web3.eth.defaultAccount
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logChannelDeposit(id, fromBlock, toBlock) {
        return this.instance.events.LogChannelDeposit({
            filter: {
                user: this.web3.eth.defaultAccount,
                id: id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
    logChannelActivate(id, fromBlock, toBlock) {
        return this.instance.events.LogChannelActivate({
            filter: {
                user: this.web3.eth.defaultAccount,
                id: id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logChannelFinalized(id, fromBlock, toBlock) {
        return this.instance.events.LogChannelFinalized({
            filter: {
                id: id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })

    }

    logClaimChannelTokens(id, fromBlock, toBlock) {
        const filter = id
            ? {
                id: id
            }
            : {}
        return this.instance.events.LogClaimChannelTokens(filter, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logDeposit(fromBlock, toBlock) {
        return this.instance.events.LogDeposit({
            filter: {
                _address: this.web3.eth.defaultAccount
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
    logWithdraw(fromBlock, toBlock) {
        return this.instance.events.LogWithdraw({
            filter: {
                _address: this.web3.eth.defaultAccount
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    /**
     * Event Decoders
     */
    logNewChannelDecode(log, topics) {
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
