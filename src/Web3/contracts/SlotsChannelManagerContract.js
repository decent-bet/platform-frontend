import BaseContract from './BaseContract'

export default class SlotsChannelManagerContract extends BaseContract {
    /**
     * Getters
     */
    async getChannelInfo(id) {
        return await this.instance.methods.getChannelInfo(id).call()
    }

    async getChannelHashes(id) {
        return await this.instance.methods.getChannelHashes(id).call()
    }
    
    async checkSig(id, msgHash, sign, turn) {
        return await this.instance.methods.checkSig(id, msgHash, sign, turn).call()
    }

    async balanceOf(address) {
        return await this.instance.methods.balanceOf(address).call()
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

    async getChannels() {
        let _options = {
            filter: {
                user: this._web3.eth.defaultAccount
            }
        }
        return await this.instance.getPastEvents('LogNewChannel', _options)
    }

    /**
     * Setters
     */
    async createChannel(deposit) {
        const encodedFunctionCall = this.instance.methods.createChannel(deposit).encodeABI()
        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async deposit(amount) {
        const encodedFunctionCall = this.instance.methods.deposit(amount).encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async withdraw(amount) {
        const encodedFunctionCall = this.instance.methods.withdraw(amount).encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async depositToChannel(id, initialUserNumber, finalUserHash) {
        const encodedFunctionCall = this.instance.methods.depositChannel(id, initialUserNumber, finalUserHash).encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async claim(id) {
        const encodedFunctionCall = this.instance.methods.claim(id).encodeABI()
        return await this.signAndSendRawTransaction(
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
        let filter = {
            user: this._web3.eth.defaultAccount
        }
        return await this.getPastEvents('LogNewChannel', filter, (fromBlock ? fromBlock : 'latest'), (toBlock ? toBlock : 'latest'))
    }

    async logChannelDeposit(id, fromBlock, toBlock) {
        let filter = {
            user: this._web3.eth.defaultAccount,
            id: id
        }
        return await this.getPastEvents('LogChannelDeposit', filter,( fromBlock ? fromBlock : 0), (toBlock ? toBlock : 'latest'))
    }

    async logChannelActivate(id, fromBlock, toBlock) {
        let filter = {
            user: this._web3.eth.defaultAccount,
            id: id
        }
        return await this.getPastEvents('LogChannelActivate', filter,( fromBlock ? fromBlock : 0), (toBlock ? toBlock : 'latest'))
    }

    async logChannelFinalized(id, fromBlock, toBlock) {
        let filter = {
            user: this._web3.eth.defaultAccount,
            id: id
        }
        
        return await this.getPastEvents('LogChannelFinalized', filter,( fromBlock ? fromBlock : 0), (toBlock ? toBlock : 'latest'))
    }

    async logClaimChannelTokens(id, fromBlock, toBlock) {
        
        let _options = {
            fromBlock: (fromBlock ? fromBlock : 0),
            toBlock: (toBlock ? toBlock : 'latest')
        }

        if(id) {
            _options.filter = { id: id }
        }
        
        return await this.instance.getPastEvents('LogClaimChannelTokens', _options)
    }

    async logDeposit(fromBlock, toBlock) {
        let filter = {
            _address: this._web3.eth.defaultAccount
        }

        return this.getPastEvents('LogDeposit', filter,( fromBlock ? fromBlock : 0), (toBlock ? toBlock : 'latest'))
    }

    async logWithdraw(fromBlock, toBlock) {
        let filter = {
            _address: this._web3.eth.defaultAccount
        }
        return await this.getPastEvents('LogWithdraw', filter,( fromBlock ? fromBlock : 0), (toBlock ? toBlock : 'latest'))
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
        return this._web3.eth.abi.decodeLog(params, log, topics)
    }
}
