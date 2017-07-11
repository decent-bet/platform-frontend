/**
 * Created by user on 4/12/2017.
 */

const ethUtil = require('ethereumjs-util')

import DecentBetToken from '../../build/contracts/DecentBetToken.json'
import House from '../../build/contracts/House.json'
import Slots from '../../build/contracts/Slots.json'
import SportsBetting from '../../build/contracts/SportsBetting.json'
import GameChannelManager from '../../build/contracts/GameChannelManager.json'
import SlotsChannel from '../../build/contracts/SlotsChannel.json'

import Web3 from 'web3'

const async = require('async')
const ethUnits = require('ethereum-units')

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const contract = require('truffle-contract')
const decentBetToken = contract(DecentBetToken)
const house = contract(House)
const sportsBetting = contract(SportsBetting)
const slots = contract(Slots)
const gameChannelManager = contract(GameChannelManager)
const slotsChannel = contract(SlotsChannel)

decentBetToken.setProvider(provider)
house.setProvider(provider)
slots.setProvider(provider)
sportsBetting.setProvider(provider)
gameChannelManager.setProvider(provider)
slotsChannel.setProvider(provider)

// Get Web3 so we can get our accounts.
const web3 = new Web3(provider)

// Declaring these for later so we can chain functions on Contract objects.
let decentBetTokenInstance, houseInstance, slotsInstance, sportsBettingInstance,
    gameChannelManagerInstance

const TYPE_DBET_TOKEN = 0, TYPE_DBET_HOUSE = 1, TYPE_DBET_SLOTS = 3,
    TYPE_DBET_SPORTS_BETTING = 4, TYPE_DBET_GAME_CHANNEL_MANAGER = 5, TYPE_DBET_SLOTS_CHANNEL = 6

class ContractHelper {

    getWeb3 = () => {
        return web3
    }

    isTokenInitialized = () => {
        return decentBetTokenInstance != null
    }

    getTokenInstance = () => {
        return decentBetTokenInstance
    }

    getSlotsInstance = () => {
        return slotsInstance
    }

    getGameChannelManagerInstance = () => {
        return gameChannelManagerInstance
    }

    getTokenContract = (callback) => {
        this.getContract(TYPE_DBET_TOKEN, callback)
    }

    getHouseContract = (callback) => {
        this.getContract(TYPE_DBET_HOUSE, callback)
    }

    getSlotsContract = (callback) => {
        this.getContract(TYPE_DBET_SLOTS, callback)
    }

    getSportsBettingContract = (callback) => {
        this.getContract(TYPE_DBET_SPORTS_BETTING, callback)
    }

    getGameChannelManagerContract = (callback) => {
        this.getContract(TYPE_DBET_GAME_CHANNEL_MANAGER, callback)
    }

    getNewSlotsChannelContract = (address, callback) => {
        this.getNewContract(TYPE_DBET_SLOTS_CHANNEL, address, callback)
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            token: (callback) => {
                this.getTokenContract((instance) => {
                    console.log('gotTokenContract')
                    self.setInstance(TYPE_DBET_TOKEN, instance)
                    callback(null, instance)
                })
            },
            house: (callback) => {
                this.getHouseContract((instance) => {
                    console.log('gotHouseContract')
                    self.setInstance(TYPE_DBET_HOUSE, instance)
                    callback(null, instance)
                })
            },
            slots: (callback) => {
                this.getSlotsContract((instance) => {
                    console.log('gotSlotsContract')
                    self.setInstance(TYPE_DBET_SLOTS, instance)
                    callback(null, instance)
                })
            },
            sportsBetting: (callback) => {
                this.getSportsBettingContract((instance) => {
                    console.log('gotSportsBettingContract')
                    self.setInstance(TYPE_DBET_SPORTS_BETTING, instance)
                    callback(null, instance)
                })
            },
            gameChannelManager: (callback) => {
                this.getGameChannelManagerContract((instance) => {
                    console.log('gotGameChannelManager')
                    self.setInstance(TYPE_DBET_GAME_CHANNEL_MANAGER, instance)
                    callback(null, instance)
                })
            }
        }, (err, results) => {
            callback(false, results.token, results.house, results.sportsBetting)
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

    getNewContract = (type, address, callback) => {
        console.log('getContract: ' + type)
        async.parallel({
            contract: (cb) => {
                this.getContractObject(type).at(address).then(function (instance) {
                    console.log('Deployed new ' + type + ': ' + instance.address)
                    cb(null, instance)
                }).catch(function (err) {
                    console.log('Deploy error: ' + type + ', ' + err)
                    cb(true, err)
                })
            }
        }, (err, result) => {
            console.log('getNewContract: callback')
            callback(err, result.contract)
        })
    }

    getContractObject = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetToken
                break
            case TYPE_DBET_HOUSE:
                return house
                break
            case TYPE_DBET_SLOTS:
                return slots
                break
            case TYPE_DBET_SPORTS_BETTING:
                return sportsBetting
                break
            case TYPE_DBET_GAME_CHANNEL_MANAGER:
                return gameChannelManager
                break
            case TYPE_DBET_SLOTS_CHANNEL:
                return slotsChannel
                break
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetTokenInstance
                break
            case TYPE_DBET_HOUSE:
                return houseInstance
                break
            case TYPE_DBET_SLOTS:
                return slotsInstance
                break
            case TYPE_DBET_SPORTS_BETTING:
                return sportsBettingInstance
                break
            case TYPE_DBET_GAME_CHANNEL_MANAGER:
                return gameChannelManagerInstance
                break
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
            case TYPE_DBET_SLOTS:
                slotsInstance = instance
                break
            case TYPE_DBET_SPORTS_BETTING:
                sportsBettingInstance = instance
                break
            case TYPE_DBET_GAME_CHANNEL_MANAGER:
                gameChannelManagerInstance = instance
                break
        }
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            token: () => {
                return {
                    allowance: (owner, spender) => {
                        return decentBetTokenInstance.allowance.call(owner, spender, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    approve: (address, value) => {
                        return decentBetTokenInstance.approve.sendTransaction(address, value, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    faucet: () => {
                        return decentBetTokenInstance.faucet.sendTransaction({
                            from: window.web3.eth.defaultAccount
                        })
                    }
                }
            },
            house: () => {
                return {
                    getCurrentQuarter: () => {
                        return houseInstance.currentQuarter()
                    },
                    getProfitSharePercent: () => {
                        return houseInstance.profitSharePercent()
                    },
                    // Mapping (uint => Quarter)
                    getQuarter: (quarter) => {
                        return houseInstance.quarters(quarter)
                    },
                    getHouseFunds: (quarter) => {
                        return houseInstance.houseFunds(quarter)
                    },
                    getUserSharesForQuarter: (quarter, address) => {
                        console.log('getUserSharesForQuarter: ' + quarter + ', ' + address +
                            ' (' + window.web3.isAddress(address) + ')')
                        return houseInstance.getUserSharesForQuarter.call(quarter, address, {
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
                    }
                }
            },
            slots: () => {
                return {
                    spin: () => {
                        // Oraclize fees are 0.01$ in Ether. Currently 0.000045 ETH = 0.01$.
                        // Send extra to make up for it.
                        let fees = 0.004 * ethUnits.units.ether
                        console.log('Sending transaction for spin with fees: ' + fees)
                        return slotsInstance.spin.sendTransaction({},
                            {from: window.web3.eth.defaultAccount, gas: 400000, value: fees})
                    },
                    testEvent: () => {
                        return slotsInstance.testEvent()
                    }
                }
            },
            sportsBetting: () => {
                return {
                    addGame: (id, parties, odds, maxBet, startTime, endTime) => {
                        console.log('Adding game: ' + id + ', ' + parties + ', ' + odds + ', ' + maxBet +
                            ', ' + startTime + ', ' + endTime)
                        return sportsBettingInstance.addGame(id, parties, odds, maxBet, startTime, endTime)
                    },
                    updateGameOdds: (id, parties, odds) => {
                        return sportsBettingInstance.updateGameOdds(id, parties, odds)
                    },
                    updateGameOutcome: (id, outcome) => {
                        return sportsBettingInstance.updateGameOutcome(id, outcome)
                    }
                }
            },
            gameChannelManager: () => {
                return {
                    createSlotsChannel: (deposit) => {
                        console.log('Creating slots channel with deposit: ' + deposit)
                        return gameChannelManagerInstance.createSlotsChannel.sendTransaction(deposit,
                            {from: window.web3.eth.defaultAccount, gas: 3000000})
                    },
                    bytesStrLen: (string) => {
                        return gameChannelManagerInstance.bytesStrLen.call(string, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    getChannel: (channel) => {
                        return gameChannelManagerInstance.channels.call(channel, {
                            from: window.web3.eth.defaultAccount
                        })
                    }
                }
            },
            slotsChannel: (slotsChannelInstance) => {
                return {
                    deposit: () => {
                        return slotsChannelInstance.deposit()
                    },
                    finalize: (currSpin, prevSpin) => {
                        currSpin = self.getSpinParts(currSpin)
                        prevSpin = self.getSpinParts(prevSpin)
                        console.log('Curr spin: ' + JSON.stringify(currSpin))
                        console.log('Prior spin: ' + JSON.stringify(prevSpin))
                        return slotsChannelInstance.finalize.call(currSpin.parts, prevSpin.parts,
                            currSpin.r, currSpin.s, prevSpin.r, prevSpin.s,
                            {from: window.web3.eth.defaultAccount})
                    },
                    getSpinHash: (spin) => {
                        return slotsChannelInstance.getSpinHash.call(spin, {
                            from: window.web3.eth.defaultAccount
                        })
                    },
                    claim: () => {
                        return slotsChannelInstance.claim()
                    }
                }
            }
        }
    }

    getSpinParts = (spin) => {
        let sign = spin.sign
        let r = ethUtil.bufferToHex(ethUtil.toBuffer(sign.slice(0, 66)))
        let s = ethUtil.bufferToHex(ethUtil.toBuffer('0x' + sign.slice(66, 130)))
        let v = ethUtil.bufferToInt(ethUtil.toBuffer('0x' + sign.slice(130, 132)))
        console.log('getSpinParts - v: ' + v + ', r: ' + r + ', s: ' + s)
        return {
            parts: spin.reelHash + '/' + (spin.reel != '' ? JSON.stringify(spin.reel) : '') + '/' + spin.reelSeedHash +
            '/' + spin.prevReelSeedHash + '/' + spin.userHash + '/' + spin.prevUserHash + '/' + spin.nonce +
            '/' + spin.turn + '/' + spin.userBalance + '/' + spin.houseBalance + '/' + spin.betSize + '/' + v,
            r: r,
            s: s
        }
    }

}

export default ContractHelper