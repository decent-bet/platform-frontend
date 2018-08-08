import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import Bluebird from 'bluebird'
import BaseContract from './BaseContract'

const keyHandler = new KeyHandler()

export default class SlotsChannelManagerContract extends BaseContract {
    /**
     * Getters
     */
    async getChannelInfo(id) {
        return await this.instance.methods.getChannelInfo(id).call({
            from: this.web3.eth.defaultAccount
        })
    }

    async getChannelHashes(id) {
        return await this.instance.methods.getChannelHashes(id).call({
            from: this.web3.eth.defaultAccount
        })
    }

    async checkSig (id, msgHash, sign, turn) {
        return await this.instance.methods.checkSig(id, msgHash, sign, turn).call({
            from: this.web3.eth.defaultAccount
        })
    }

    async balanceOf(address, session) {
        return await this.instance.methods.balanceOf(address, session).call()
    }

    async currentSession() {
        const a = await this.instance.methods.currentSession().call()
        a.then(a => {
            console.log(a)
        }, console.log)
        return a
    }

    async getPlayer(id, isHouse) {
        return await this.instance.methods.getPlayer(id, isHouse).call()
    }

    async isChannelClosed(id) {
        return await this.instance.methods.isChannelClosed(id).call()
    }

    async finalBalances(id, isHouse) {
        return await this.instance.methods.finalBalances(id, isHouse).call()
    }

    async channelDeposits(id, isHouse) {
        return await this.instance.methods.channelDeposits(id, isHouse).call()
    }

    async getChannelCount() {
        let count = await this.instance.methods.channelCount().call()
        try {
            return Number(count)
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    getChannels() {
        return Bluebird.fromCallback(cb =>
            this.getPastEvents(
                'LogNewChannel',
                {
                    filter: {
                        user: this.web3.eth.defaultAccount
                    },
                    fromBlock: 0,
                    toBlock: 'latest'
                },
                cb
            )
        )
    }

    /**
     * Setters
     */
    async createChannel(deposit) {
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

        return await this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async deposit(amount) {
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

        return await this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async withdraw(amount, session) {
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

        return await this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async depositToChannel(id, initialUserNumber, finalUserHash) {
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

        return await this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async claim(id) {
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

        return await this.signAndSendRawTransaction(
            keyHandler.get(),
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    /**
     * Events
     */
    async logNewChannel(fromBlock, toBlock) {
        return await this.getPastEvents('LogNewChannel', {
            filter: {
                user: this.web3.eth.defaultAccount
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logChannelDeposit(id, fromBlock, toBlock) {
        return await this.getPastEvents('LogChannelDeposit', {
            filter: {
                user: this.web3.eth.defaultAccount,
                id: id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logChannelActivate(id, fromBlock, toBlock) {
        return await this.getPastEvents('LogChannelActivate', {
            filter: {
                user: this.web3.eth.defaultAccount,
                id: id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logChannelFinalized(id, fromBlock, toBlock) {
        return await this.getPastEvents('LogChannelFinalized', {
            filter: {
                id: id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logClaimChannelTokens(id, fromBlock, toBlock) {
        const filter = id
            ? {
                  id: id
              }
            : {}
        return await this.getPastEvents('LogClaimChannelTokens', filter, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logDeposit(fromBlock, toBlock) {
        return this.getPastEvents('LogDeposit', {
            filter: {
                _address: this.web3.eth.defaultAccount
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    async logWithdraw(fromBlock, toBlock) {
        return await this.getPastEvents('LogWithdraw', {
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
