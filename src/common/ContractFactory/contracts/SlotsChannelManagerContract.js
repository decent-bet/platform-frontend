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
                user: await this._keyHandler.getPublicAddress()
            },
            toBlock: 'latest',
            order: 'DESC'
        }

        return await this.instance.getPastEvents('LogNewChannel', config)
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
        let listenerSettings = {
            config: {
                filter: {
                    user: await this._keyHandler.getPublicAddress()
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

    async logChannelActivate(channelId) {
        return new Promise((resolve, reject) => {
            this.instance.events
                .LogChannelActivate({
                    filter: {
                        id: channelId
                    }
                })
                .on('data', data => {
                    resolve(data.returnValues.id)
                })
                .on('error', err => {
                    reject(err)
                })
        })
    }

    async logChannelFinalized(id, fromBlock, toBlock) {
        return new Promise(async (resolve, reject) => {
            this.instance.events
                .LogChannelFinalized({
                    filter: {
                        user: await this._keyHandler.getPublicAddress(),
                        id
                    },
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest'
                })
                .on('data', data => {
                    resolve(data.returnValues.id)
                })
                .on('error', err => {
                    reject(err)
                })
        })
    }

    async logClaimChannelTokens(id, fromBlock, toBlock) {
        return new Promise((resolve, reject) => {
            this.instance.events
                .LogClaimChannelTokens({
                    filter: {
                        id
                    },
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest'
                })
                .on('data', data => {
                    resolve({
                        id: data.returnValues.id,
                        isHouse: data.returnValues.isHouse
                    })
                })
                .on('error', err => {
                    reject(err)
                })
        })
    }

    async logDeposit(fromBlock, toBlock) {
        return new Promise(async (resolve, reject) => {
            this.instance.events
                .LogDeposit({
                    filter: {
                        _address: await this._keyHandler.getPublicAddress()
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

    async logWithdraw(fromBlock, toBlock) {
        return new Promise(async (resolve, reject) => {
            this.instance.events
                .LogWithdraw({
                    filter: {
                        _address: await this._keyHandler.getPublicAddress()
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
}
