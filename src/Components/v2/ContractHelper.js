/**
 * Created by user on 4/12/2017.
 */

const ethUtil = require('ethereumjs-util')

import DecentBetToken from '../../../build/contracts/TestDecentBetToken.json'
import House from '../../../build/contracts/House.json'
import BettingProvider from '../../../build/contracts/BettingProvider.json'
import SlotsChannelFinalizer from '../../../build/contracts/SlotsChannelFinalizer.json'
import SlotsChannelManager from '../../../build/contracts/SlotsChannelManager.json'

import Web3 from 'web3'

const async = require('async')

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const contract = require('truffle-contract')
const decentBetToken = contract(DecentBetToken)
const house = contract(House)
const bettingProvider = contract(BettingProvider)
const slotsChannelFinalizer = contract(SlotsChannelFinalizer)
const slotsChannelManager = contract(SlotsChannelManager)

decentBetToken.setProvider(provider)
house.setProvider(provider)
bettingProvider.setProvider(provider)
slotsChannelFinalizer.setProvider(provider)
slotsChannelManager.setProvider(provider)

// Get Web3 so we can get our accounts.
const web3 = new Web3(provider)

// Declaring these for later so we can chain functions on Contract objects.
let decentBetTokenInstance, houseInstance, bettingProviderInstance, slotsChannelFinalizerInstance,
    slotsChannelManagerInstance

const TYPE_DBET_TOKEN = 0,
    TYPE_DBET_HOUSE = 1,
    TYPE_DBET_BETTING_PROVIDER = 2,
    TYPE_DBET_SLOTS_CHANNEL_FINALIZER = 3,
    TYPE_DBET_SLOTS_CHANNEL_MANAGER = 4

class ContractHelper {

    getWeb3 = () => {
        return web3
    }

    getTokenInstance = () => {
        return decentBetTokenInstance
    }

    getSlotsChannelManagerInstance = () => {
        return slotsChannelManagerInstance
    }

    getHouseInstance = () => {
        return houseInstance
    }

    getTokenContract = (callback) => {
        this.getContract(TYPE_DBET_TOKEN, callback)
    }

    getHouseContract = (callback) => {
        this.getContract(TYPE_DBET_HOUSE, callback)
    }

    getBettingProviderContract = (callback) => {
        this.getContract(TYPE_DBET_BETTING_PROVIDER, callback)
    }

    getSlotsChannelManagerContract = (callback) => {
        this.getContract(TYPE_DBET_SLOTS_CHANNEL_MANAGER, callback)
    }

    getSlotsChannelFinalizerContract = (callback) => {
        this.getContract(TYPE_DBET_SLOTS_CHANNEL_FINALIZER, callback)
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            token: (callback) => {
                this.getTokenContract((instance) => {
                    self.setInstance(TYPE_DBET_TOKEN, instance)
                    callback(null, instance)
                })
            },
            house: (callback) => {
                this.getHouseContract((instance) => {
                    self.setInstance(TYPE_DBET_HOUSE, instance)
                    callback(null, instance)
                })
            },
            bettingProvider: (callback) => {
                this.getBettingProviderContract((instance) => {
                    self.setInstance(TYPE_DBET_BETTING_PROVIDER, instance)
                    callback(null, instance)
                })
            },
            slotsChannelManager: (callback) => {
                this.getSlotsChannelManagerContract((instance) => {
                    self.setInstance(TYPE_DBET_SLOTS_CHANNEL_MANAGER, instance)
                    callback(null, instance)
                })
            },
            slotsChannelFinalizer: (callback) => {
                this.getSlotsChannelFinalizerContract((instance) => {
                    self.setInstance(TYPE_DBET_SLOTS_CHANNEL_FINALIZER, instance)
                    callback(null, instance)
                })
            },
        }, (err, results) => {
            callback(false, results.token, results.house, results.bettingProvider)
        })
    }

    getContract = (type, callback) => {
        const self = this
        let instance = this.getInstance(type)
        if (!instance) {
            console.log('getContract: ' + type)
            this.getContractObject(type).deployed().then(function (_instance) {
                console.log('Deployed ' + type + ': ' + _instance.address)
                self.setInstance(type, _instance)
                callback(_instance)
            }).catch(function (err) {
                console.log('Deploy error: ' + type + ', ' + err)
            })
        } else
            callback(instance)
    }

    getContractObject = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetToken
            case TYPE_DBET_HOUSE:
                return house
            case TYPE_DBET_BETTING_PROVIDER:
                return bettingProvider
            case TYPE_DBET_SLOTS_CHANNEL_FINALIZER:
                return slotsChannelFinalizer
            case TYPE_DBET_SLOTS_CHANNEL_MANAGER:
                return slotsChannelManager
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetTokenInstance
            case TYPE_DBET_HOUSE:
                return houseInstance
            case TYPE_DBET_BETTING_PROVIDER:
                return bettingProviderInstance
            case TYPE_DBET_SLOTS_CHANNEL_FINALIZER:
                return slotsChannelFinalizerInstance
            case TYPE_DBET_SLOTS_CHANNEL_MANAGER:
                return slotsChannelManagerInstance
        }
        return null
    }

    setInstance = (type, instance) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                decentBetTokenInstance = instance
                break
            case TYPE_DBET_HOUSE:
                houseInstance = instance
                break
            case TYPE_DBET_BETTING_PROVIDER:
                bettingProviderInstance = instance
                break
            case TYPE_DBET_SLOTS_CHANNEL_FINALIZER:
                slotsChannelFinalizerInstance = instance
                break
            case TYPE_DBET_SLOTS_CHANNEL_MANAGER:
                slotsChannelManagerInstance = instance
                break
        }
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            token: () => {
                return {
                    /** Getters */
                    allowance: (owner, spender) => {
                        return decentBetTokenInstance.allowance.call(owner, spender, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    balanceOf: (address) => {
                        return decentBetTokenInstance.balanceOf.call(address, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    /** Setters */
                    approve: (address, value) => {
                        return decentBetTokenInstance.approve.sendTransaction(address, value, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    faucet: () => {
                        return decentBetTokenInstance.faucet.sendTransaction({
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    /**
                     * Events
                     * */
                    logTransfer: (address, isFrom, fromBlock, toBlock) => {
                        let options = {}
                        options[isFrom ? 'from' : 'to'] = address
                        return decentBetTokenInstance.Transfer(options, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            },
            house: () => {
                return {
                    /**
                     * Getters
                     */
                    getCurrentSession: () => {
                        return houseInstance.currentSession()
                    },
                    getProfitSharePercent: () => {
                        return houseInstance.profitSharePercent()
                    },
                    // Mapping (uint => Session)
                    getSession: (sessionNumber) => {
                        return houseInstance.sessions(sessionNumber)
                    },
                    getHouseFunds: (sessionNumber) => {
                        return houseInstance.houseFunds(sessionNumber)
                    },
                    getUserCreditsForSession: (sessionNumber, address) => {
                        return houseInstance.getUserCreditsForSession.call(sessionNumber, address, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    getAuthorizedAddresses: (index) => {
                        return houseInstance.authorizedAddresses(index)
                    },
                    addToAuthorizedAddresses: (address) => {
                        return houseInstance.addToAuthorizedAddresses(address)
                    },
                    removeFromAuthorizedAddresses: (address) => {
                        return houseInstance.removeFromAuthorizedAddresses(address)
                    },
                    lotteries: (session) => {
                        return houseInstance.lotteries(session)
                    },
                    lotteryTicketHolders: (session, ticketNumber) => {
                        return houseInstance.lotteryTicketHolders(session, ticketNumber)
                    },
                    lotteryUserTickets: (session, address, index) => {
                        return houseInstance.lotteryUserTickets(session, address, index)
                    },
                    /**
                     * Setters
                     */
                    purchaseCredits: (amount) => {
                        return houseInstance.purchaseCredits.sendTransaction(amount, {
                            from: window.web3.eth.defaultAccount,
                            gas: 3000000
                        })
                    },
                    /**
                     * Events
                     */
                    logPurchasedCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogPurchasedCredits({
                            creditHolder: window.web3.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logLiquidateCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogLiquidateCredits({
                            creditHolder: window.web3.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            },
            bettingProvider: () => {
                return {
                    addGame: (id, parties, odds, maxBet, startTime, endTime) => {
                        console.log('Adding game: ' + id + ', ' + parties + ', ' + odds + ', ' + maxBet +
                            ', ' + startTime + ', ' + endTime)
                        return bettingProviderInstance.addGame(id, parties, odds, maxBet, startTime, endTime)
                    },
                    updateGameOdds: (id, parties, odds) => {
                        return bettingProviderInstance.updateGameOdds(id, parties, odds)
                    },
                    updateGameOutcome: (id, outcome) => {
                        return bettingProviderInstance.updateGameOutcome(id, outcome)
                    }
                }
            },
            slotsChannelFinalizer: () => {

            },
            slotsChannelManager: () => {
                return {
                    /**
                     * Getters
                     */
                    getChannelInfo: (id) => {
                        return slotsChannelManagerInstance.getChannelInfo.call(id, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    getChannelHashes: (id) => {
                        return slotsChannelManagerInstance.getChannelHashes.call(id, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    checkSig: (id, msgHash, sign, turn) => {
                        console.log('Checksig', id, msgHash, sign, turn)
                        return slotsChannelManagerInstance.checkSig.call(id, msgHash, sign, turn, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    balanceOf: (address, session) => {
                        return slotsChannelManagerInstance.balanceOf.call(address, session, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    currentSession: () => {
                        return slotsChannelManagerInstance.currentSession.call({
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    /**
                     * Setters
                     */
                    createChannel: (deposit) => {
                        return slotsChannelManagerInstance.createChannel.sendTransaction(deposit,
                            {from: window.web3.eth.defaultAccount, gas: 3000000})
                    },
                    deposit: (amount) => {
                        return slotsChannelManagerInstance.deposit.sendTransaction(amount,
                            {from: window.web3.eth.defaultAccount, gas: 3000000})
                    },
                    depositToChannel: (id, initialUserNumber, finalUserHash) => {
                        return slotsChannelManagerInstance.depositChannel.sendTransaction(id,
                            initialUserNumber, finalUserHash,
                            {from: window.web3.eth.defaultAccount, gas: 3000000})
                    },
                    finalize: (id, userSpin, houseSpin) => {
                        id = parseInt(id)
                        userSpin = self.getSpinParts(userSpin)
                        houseSpin = self.getSpinParts(houseSpin)

                        console.log('Finalize', id, typeof id)

                        let logKeys = (spin) => {
                            Object.keys(spin).forEach((key) => {
                                console.log('Finalize', key, spin[key], typeof spin[key])
                            })
                        }
                        logKeys(userSpin)
                        logKeys(houseSpin)

                        console.log('Finalize string: \"' + id + '\", \"' + userSpin.parts + '\", \"' +
                            houseSpin.parts + '\", \"' + userSpin.r + '\", \"' + userSpin.s + '\", \"' +
                            houseSpin.r + '\", \"' + houseSpin.s + '\"')

                        return slotsChannelManagerInstance.finalize.sendTransaction(id, userSpin.parts,
                            houseSpin.parts, userSpin.r, userSpin.s, houseSpin.r, houseSpin.s, {
                                from: window.web3.eth.defaultAccount, gas: 3000000
                            })
                    },
                    /**
                     * Events
                     */
                    logNewChannel: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogNewChannel({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelDeposit: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelDeposit({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelActivate: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelActivate({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logChannelFinalized: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogChannelFinalized({
                            user: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logDeposit: (fromBlock, toBlock) => {
                        return slotsChannelManagerInstance.LogDeposit({
                            _address: window.web3.eth.defaultAccount
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            }
        }
    }

    getSpinParts = (spin) => {
        let sign = spin.sign

        let sigParams = ethUtil.fromRpcSig(sign)

        let r = ethUtil.bufferToHex(sigParams.r)
        let s = ethUtil.bufferToHex(sigParams.s)
        let v = ethUtil.bufferToInt(sigParams.v)

        console.log('getSpinParts sig: ', v, r, s)

        console.log('getSpinParts reverse sig: ', ethUtil.toRpcSig(v, r, s))

        return {
            parts: spin.reelHash + '/' + (spin.reel != '' ? spin.reel.toString() : '') + '/' + spin.reelSeedHash +
            '/' + spin.prevReelSeedHash + '/' + spin.userHash + '/' + spin.prevUserHash + '/' + spin.nonce +
            '/' + spin.turn + '/' + spin.userBalance + '/' + spin.houseBalance + '/' + spin.betSize + '/' + v,
            r: r,
            s: s
        }
    }

}

export default ContractHelper