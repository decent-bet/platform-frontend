import BaseContract from './BaseContract'
import { SlotsChannelManager } from '../../../../typings/SlotsChannelManager'

export default class SlotsChannelManagerContract extends BaseContract<
    SlotsChannelManager
> {
    /**
     * Getters
     */
    public async getChannelInfo(id) {
        const info = await this.instance.methods.getChannelInfo(id).call()
        return info
    }

    public async getChannelHashes(id) {
        return await this.instance.methods.getChannelHashes(id).call()
    }

    public async getChannelNonce(id) {
        return await this.instance.methods.getChannelNonce(id).call()
    }

    public async checkSig(id, msgHash, sign, turn) {
        return await this.instance.methods
            .checkSig(id, msgHash, sign, turn)
            .call()
    }

    public async balanceOf(address) {
        return await this.instance.methods.balanceOf(address).call()
    }

    public async getPlayer(id, isHouse) {
        return await this.instance.methods.getPlayer(id, isHouse).call()
    }

    public async isChannelClosed(id) {
        return await this.instance.methods.isChannelClosed(id).call()
    }

    public async finalBalances(id, isHouse) {
        return await this.instance.methods.finalBalances(id, isHouse).call()
    }

    public async channelDeposits(id, isHouse) {
        return await this.instance.methods.channelDeposits(id, isHouse).call()
    }

    public async getChannelCount() {
        let count = await this.instance.methods.channelCount().call()
        try {
            return Number(count)
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    public async getChannels() {
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
    public async createChannel(deposit) {
        // @ts-ignore
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

    public async deposit(amount) {
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

    public async withdraw(amount) {
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

    public async depositToChannel(id, initialUserNumber, finalUserHash) {
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

    public async claim(id) {
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
    public async logNewChannel(transaction) {
        const userAddress = await this._keyHandler.getPublicAddress()
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
            // @ts-ignore
            listenerSettings,
            events => events && events.length > 0
        )
        let [event] = events
        if (!event || !event.returnValues || !event.returnValues.id) {
            throw new Error(
                'Create channel confirmation error related to the event received.'
            )
        }

        // return the channel id
        return event.returnValues.id
    }

    public logChannelActivate(channelId) {
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
                // @ts-ignore
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

    public async logChannelFinalized(id, fromBlock, toBlock) {
        const userAddress = await this._keyHandler.getPublicAddress()
        return this.instance.events.LogChannelFinalized({
            filter: {
                user: userAddress,
                id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            // @ts-ignore
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    public logClaimChannelTokens(id, fromBlock, toBlock) {
        return this.instance.events.LogClaimChannelTokens({
            filter: {
                id
            },
            fromBlock: fromBlock ? fromBlock : 0,
            // @ts-ignore
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    public logDeposit(fromBlock, toBlock) {
        return new Promise(async (resolve, reject) => {
            this.instance.events
                .LogDeposit({
                    filter: {
                        _address: await this._keyHandler.getPublicAddress()
                    },
                    fromBlock: fromBlock ? fromBlock : 0,
                    // @ts-ignore
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

    public logWithdraw(fromBlock, toBlock) {
        return new Promise(async (resolve, reject) => {
            let listenerSettings = {
                config: {
                    filter: {
                        _address: await this._keyHandler.getPublicAddress()
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
                // @ts-ignore
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
