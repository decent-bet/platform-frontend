import BaseContract from './BaseContract'

export default class SlotsChannelManagerContract extends BaseContract {
    /**
     * Getters
     */
    async getChannelInfo(id) {
        const info = await this.instance.methods.getChannelInfo(id).call()
        return info
    }

    async getChannelHashes(id) {
        return await this.instance.methods.getChannelHashes(id).call()
    }

    async getChannelNonce(id) {
        return await this.instance.methods.getChannelNonce(id).call()
    }

    async checkSig(id, msgHash, sign, turn) {
        return await this.instance.methods
            .checkSig(id, msgHash, sign, turn)
            .call()
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
                user: this._thorify.eth.defaultAccount
            },
            toBlock: 'latest',
            order: 'DESC'
        }

        return await this.instance.getPastEvents('LogNewChannel', config)
    }

    async getFinalizedChannels() {
        let config = {
            filter: {
                user: this._thorify.eth.defaultAccount
            },
            toBlock: 'latest',
            order: 'DESC'
        }

        return await this.instance.getPastEvents('LogChannelFinalized', config)
    }

    async getClaimedChannels(id) {
        let config = {
            filter: {
                id
            },
            toBlock: 'latest',
            order: 'DESC'
        }

        return await this.instance.getPastEvents(
            'LogClaimChannelTokens',
            config
        )
    }

    /**
     * Setters
     */
    async createChannel(deposit) {
        const encodedFunctionCall = this.instance.methods
            .createChannel(deposit)
            .encodeABI()
        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async deposit(amount) {
        const encodedFunctionCall = this.instance.methods
            .deposit(amount)
            .encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async withdraw(amount) {
        const encodedFunctionCall = this.instance.methods
            .withdraw(amount)
            .encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async depositToChannel(id, initialUserNumber, finalUserHash) {
        const encodedFunctionCall = this.instance.methods
            .depositChannel(id, initialUserNumber, finalUserHash)
            .encodeABI()

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
        const userAddress = await this._thorify.eth.defaultAccount
        let listenerSettings = {
            config: {
                filter: {
                    user: userAddress
                },
                fromBlock: transaction.blockNumber,
                toBlock: transaction.blockNumber,
                order: 'DESC',
                options: { offset: 0, limit: 1 }
            },
            interval: 5000,
            top: 30
        }

        let events = await this.listenForEvent(
            'LogNewChannel',
            listenerSettings,
            events => events && events.length > 0
        )
        let [event] = events
        if (!event || !event.returnValues || !event.returnValues.id) {
            throw new Error(
                'Create channel confirmation error related to the event received.'
            )
        }

        //return the channel id
        return event.returnValues.id
    }

    logChannelActivate(channelId) {
        return new Promise(async (resolve, reject) => {
            let listenerSettings = {
                config: {
                    filter: {
                        id: channelId
                    }
                },
                interval: 2000,
                top: null
            }

            let events = await this.listenForEvent(
                'LogChannelActivate',
                listenerSettings,
                events => events && events.length > 0
            )

            let [event] = events
            if (!event || !event.returnValues || !event.returnValues) {
                reject(new Error('Error on LogChannelActivate.'))
            }

            resolve(event.returnValues.id)
        })
    }

    logChannelFinalized(id, fromBlock, toBlock) {
        const userAddress = this._thorify.eth.defaultAccount
        const filter = {
            user: userAddress
        }

        if (id) {
            filter.id = id
        }

        return this.instance.events.LogChannelFinalized({
            filter,
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logClaimChannelTokens(id, fromBlock, toBlock, isHouse) {
        const filter = {}
        if (id) {
            filter.id = id
        }
        if (isHouse) {
            filter.isHouse = isHouse
        } else {
            filter.isHouse = false
        }

        return this.instance.events.LogClaimChannelTokens({
            filter,
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logDeposit(fromBlock, toBlock) {
        return new Promise((resolve, reject) => {
            this.instance.events
                .LogDeposit({
                    filter: {
                        _address: this._thorify.eth.defaultAccount
                    },
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest'
                })
                .on('data', data => {
                    resolve(data)
                })
                .on('error', err => {
                    reject(err)
                })
        })
    }

    logWithdraw(fromBlock, toBlock) {
        return new Promise(async (resolve, reject) => {
            let listenerSettings = {
                config: {
                    filter: {
                        _address: this._thorify.eth.defaultAccount
                    },
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest',
                    order: 'DESC',
                    options: { offset: 0, limit: 1 }
                },
                interval: 1000,
                top: 60
            }

            let events = await this.listenForEvent(
                'LogWithdraw',
                listenerSettings,
                events => events && events.length > 0
            )
            let [event] = events
            if (!event || !event.returnValues || !event.returnValues) {
                reject(new Error('Error on logWithdraw.'))
            }

            resolve(event.returnValues)
        })
    }
}
