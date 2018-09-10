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
        let config = {
            filter: {
                user: this._web3.eth.defaultAccount
            },
            toBlock: 'latest',
            order:'DESC'
        }

        return await this.instance.getPastEvents('LogNewChannel', config)
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
    async logNewChannel(transaction) {

    let listenerSettings = {
        config: { filter: { user: this._web3.eth.defaultAccount 
                          }, 
                            fromBlock: transaction.blockNumber, 
                            toBlock: transaction.blockNumber, 
                            order: 'DESC', 
                            options: { offset: 0, limit: 1 } },
        interval: 5000,
        top: 30
    }

    let events = await this.listenForEvent('LogNewChannel', 
                                                    listenerSettings, 
                                                    (events) => events && events.length > 0)
    let [event] = events
    if (!event || !event.returnValues || !event.returnValues.id) {
        throw new Error('Create channel confirmation error related to the event received.')
    }
    
    //return the channel id
    return event.returnValues.id
    }

    async logChannelDeposit(channelId, transaction) {
        
        let listenerSettings = {
            config: { filter: { id: channelId, user: this._web3.eth.defaultAccount 
                              }, 
                                fromBlock: transaction.blockNumber, 
                                toBlock: transaction.blockNumber, 
                                order: 'DESC', 
                                options: { offset: 0, limit: 1 } },
            interval: 5000,
            top: 30
        }
    
        let events = await this.listenForEvent('LogChannelDeposit', 
                                                        listenerSettings, 
                                                        (events) => events && events.length > 0)
        let [event] = events
        if (!event || !event.returnValues || !event.returnValues.id) {
            throw new Error('Channel deposit confirmation error related to the event received.')
        }
        
        //return true if the returned value id is equals to the channelId 
        return event.returnValues.id 
    }

    async logChannelActivate(channelId) {
        
        const channelIdParam = this._web3.eth.abi.encodeParameter('bytes32', channelId)
        let listenerSettings = {
            config: { filter: { 
                                id: channelIdParam,
                                user: this._web3.eth.defaultAccount 
                              },
                                order: 'DESC', 
                                options: { offset: 0, limit: 1 } },
            interval: 5000,
            top: 30
        }
    
        let events = await this.listenForEvent('LogChannelActivate', 
                                               listenerSettings, 
                                               (events) => events && events.length > 0)
    
        let [event] = events
        if (!event || !event.returnValues || !event.returnValues.id) {
            throw new Error('Activate channel confirmation error related to the event received.')
        }
        //return the activated id
        return event.returnValues.id
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

    logChannelDepositDecode(log, topics) {
        const params = [
            {
                indexed: true,
                name: 'id',
                type: 'bytes32'
            },
            {
                indexed: false,
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                name: 'finalUserHash',
                type: 'string'
            }
        ]
        return this._web3.eth.abi.decodeLog(params, log, topics)
    }

    logChannelActivateDecode(log, topics) {
        const params = [
            {
                indexed: true,
                name: 'id',
                type: 'bytes32'
            },
            {
                indexed: false,
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                name: 'finalSeedHash',
                type: 'string'
            },
            {
                indexed: false,
                name: 'finalReelHash',
                type: 'string'
            }
        ]
        return this._web3.eth.abi.decodeLog(params, log, topics)
    }

}
