import SlotsChannelManagerJson from '../../../build/contracts/SlotsChannelManager.json'
import KeyHandler from '../KeyHandler'
import ethAbi from 'web3-eth-abi'
import AbstractContract from './AbstractContract'
import { Observable } from 'rxjs'

// Used for VSCode Type Checking
import Web3 from 'web3' // eslint-disable-line no-unused-vars

const keyHandler = new KeyHandler()

export default class SlotsChannelManager extends AbstractContract {
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
    getChannelInfo(id) {
        return this.contract.methods.getChannelInfo(id).call({
            from: this.web3.eth.defaultAccount
        })
    }

    getChannelHashes(id) {
        return this.contract.methods.getChannelHashes(id).call({
            from: this.web3.eth.defaultAccount
        })
    }

    checkSig = (id, msgHash, sign, turn) => {
        return this.contract.methods.checkSig(id, msgHash, sign, turn).call({
            from: this.web3.eth.defaultAccount
        })
    }

    balanceOf(address, session) {
        return this.contract.methods.balanceOf(address, session).call()
    }

    currentSession() {
        return this.contract.methods.currentSession().call()
    }

    getPlayer(id, isHouse) {
        return this.contract.methods.getPlayer(id, isHouse).call()
    }

    isChannelClosed(id) {
        return this.contract.methods.isChannelClosed(id).call()
    }

    finalBalances(id, isHouse) {
        return this.contract.methods.finalBalances(id, isHouse).call()
    }

    channelDeposits(id, isHouse) {
        return this.contract.methods.channelDeposits(id, isHouse).call()
    }

    async getChannelCount() {
        let count = await this.contract.methods.channelCount().call()
        try {
            return parseInt(count)
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    getChannels(fromBlock, toBlock, fun) {
        const event = this.contract.events.LogNewChannel({
            filter: {
                user: this.web3.eth.defaultAccount
            },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
        
        const data$ = Observable.fromEvent(event, 'data')
            .flatMap(item => {
                if (item.returnValues && item.returnValues.id) {
                    return [item.returnValues.id]
                }

                return item.returnValues.map(i => i.id)
            })
            .switchMap( channelId => {
                return fun(channelId)
            })

        return data$

        //     //Query a list of all channel ids
        //     contract.getChannels()
        //     .on('data', (data) => {
        //         let list = []
        //         if (Array.isArray(data.returnValues)) {
        //             list = data.returnValues.map(item => item.id)
        //         } else {
        //             list.push(data.returnValues.id)
        //         }

        //         list.forEach(async (id) => {
        //             const resultPromise = await getChannel(id)
        //             accumulator[id] = resultPromise
        //         })
        //     })
        //     .on('error', (error) => {
        //         return Promise.reject(error)
        //     })

        // // Execute all promises simultaneously.
        // return Bluebird.props(accumulator)

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
            this.contract.options.address,
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
            this.contract.options.address,
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
            this.contract.options.address,
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
            this.contract.options.address,
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
            this.contract.options.address,
            null,
            5000000,
            encodedFunctionCall
        )
    }

    /**
     * Events
     */
    logNewChannel(fromBlock, toBlock) {
        return this.contract.events.LogNewChannel({ filter: {
            user: this.web3.eth.defaultAccount
        },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
    
    logChannelDeposit(id, fromBlock, toBlock) {
        return this.contract.events.LogChannelDeposit({ filter: {
            user: this.web3.eth.defaultAccount,
            id: id
        },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
    logChannelActivate(id, fromBlock, toBlock) {
        return this.contract.events.LogChannelActivate({ filter: {
            user: this.web3.eth.defaultAccount,
            id: id
        },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logChannelFinalized(id, fromBlock, toBlock) {
        return this.contract.events.LogChannelFinalized({ filter: {
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
        return this.contract.events.LogClaimChannelTokens(filter, {
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }

    logDeposit(fromBlock, toBlock) {
        return this.contract.events.LogDeposit({ filter: {
            _address: this.web3.eth.defaultAccount
        },
            fromBlock: fromBlock ? fromBlock : 0,
            toBlock: toBlock ? toBlock : 'latest'
        })
    }
    logWithdraw(fromBlock, toBlock) {
        return this.contract.events.LogWithdraw({ filter: {
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
