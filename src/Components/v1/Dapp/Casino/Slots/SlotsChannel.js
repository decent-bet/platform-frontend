/**
 * Created by user on 6/10/2017.
 */

import React, {Component} from 'react'

const async = require('async')
const BigNumber = require('bignumber.js')
const ethUnits = require('ethereum-units')
const ethUtil = require('ethereumjs-util')
let cryptoJs = require("crypto-js");
import sha256 from 'crypto-js/sha256'

import DecentAPI from '../../../Base/DecentAPI'
import Helper from '../../../Helper'
import Iframe from '../../../Base/Iframe'
import Loading from '../../../Base/Loading'

const decentApi = new DecentAPI()
const helper = new Helper()

let userHashes = []
let initialUserNumber
let lastHash

let slotReels, paytable
const symbolA = 1, symbolB = 2, symbolC = 3, symbolD = 4, symbolE = 5, symbolF = 6, symbolG = 7

const PLAYER_USER = 'user', PLAYER_HOUSE = 'house'

let NUMBER_OF_LINES = 5, NUMBER_OF_REELS = 5

import './slotschannel.css'

class SlotsChannel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            lastChannelTx: '',
            loading: false,
            message: '',
            isCreateChannel: false,
            existingChannels: {},
            channelContracts: {},
            activeChannel: null
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        /** Client-side data */
        this.helpers().initSlotReels()
        this.helpers().initPaytable()
        this.helpers().initSlotsController()

        /** Watchers */
        this.watchers().newChannel()
        this.watchers().channelFinalized()

    }

    helpers = () => {
        const self = this
        return {
            initSlotReels: () => {
                slotReels = {}
                slotReels[0] = [7, 2, 2, 1, 5, 3, 5, 3, 2, 2, 3, 4, 2, 5, 1, 1, 6, 4, 1, 5, 3]
                slotReels[1] = [1, 1, 3, 3, 5, 3, 5, 1, 2, 2, 4, 1, 3, 4, 3, 2, 2, 6, 6, 3, 7]
                slotReels[2] = [4, 2, 7, 3, 2, 6, 1, 4, 3, 1, 5, 1, 1, 4, 4, 1, 5, 2, 2, 1, 1]
                slotReels[3] = [1, 1, 5, 1, 2, 7, 4, 2, 1, 3, 2, 2, 3, 1, 1, 2, 6, 2, 6, 3, 5]
                slotReels[4] = [1, 4, 1, 1, 2, 4, 1, 3, 6, 2, 7, 2, 4, 1, 3, 1, 3, 6, 1, 2, 5]
            },
            initPaytable: () => {
                paytable = {}
                paytable[symbolA] = 10
                paytable[symbolB] = 20
                paytable[symbolC] = 40
                paytable[symbolD] = 50
                paytable[symbolE] = 75
                paytable[symbolF] = 150
                paytable[symbolG] = 300
            },
            initSlotsController: () => {
                window.slotsController = () => {
                    return {
                        spin: (betSize, callback) => {
                            self.helpers().spin(betSize, callback)
                        },
                        balances: () => {
                            let lastHouseSpin = self.helpers().getHouseSpin(this.state.activeChannel.houseSpins.length - 1)
                            let nonce = self.state.activeChannel.nonce
                            let userBalance = ((nonce == 1) ? (self.state.activeChannel.depositAmount) :
                                lastHouseSpin.userBalance)
                            let houseBalance = ((nonce == 1) ? (self.state.activeChannel.depositAmount) :
                                lastHouseSpin.houseBalance)
                            return {
                                user: helper.formatEther(userBalance),
                                house: helper.formatEther(houseBalance)
                            }
                        }
                    }
                }
            },
            checkIfChannelExists: (id) => {
                helper.getContractHelper().getWrappers().slotsChannelManager().getChannelInfo(id).then((channel) => {
                    let exists = channel[0]
                    let user = channel[1]
                    let deposit = channel[2]
                    console.log('Retrieved channel: ', user, exists, deposit)
                    if (exists)
                        self.helpers().addToExistingChannels(id, user, exists)
                })
            },
            addToExistingChannels: (id, user, exists) => {
                let existingChannels = self.state.existingChannels
                existingChannels[id] = {
                    user: user,
                    exists: exists
                }
                console.log('addToExistingChannels', JSON.stringify(existingChannels[id]))
                self.setState({
                    existingChannels: existingChannels
                })
            },
            createChannel: () => {
                const deposit = new BigNumber(1000).times(helper.getEtherInWei()).toFixed(0)
                console.log('Creating channel with deposit: ' + deposit)
                helper.getContractHelper().getWrappers().slotsChannelManager()
                    .createChannel(deposit).then((tx) => {
                    self.helpers().toggleLoading(true, 'Creating channel..')
                    self.setState({
                        lastChannelTx: tx
                    })
                    console.log('Creating channel => ' + JSON.stringify(tx))
                }).catch((err) => {
                    console.log('Error creating channel => ' + err)
                })
            },
            getInitialRandomNumber: () => {
                return self.helpers().getRandomNumber(18) + ""
            },
            getUserHashes: (randomNumber) => {
                let hashes = []
                let aesKey = self.state.activeChannel.aesKey
                initialUserNumber = cryptoJs.AES.encrypt(randomNumber, aesKey).toString()
                let startTime = helper.getTimestampMillis()
                console.log('Random number: ' + randomNumber + ', key: ' + aesKey +
                    ', initialUserNumber: ' + initialUserNumber)
                for (let i = 0; i < 1000; i++) {
                    let hash = sha256(i == 0 ? randomNumber : lastHash).toString()
                    hashes.push(hash)
                    lastHash = hash
                }
                console.log('Time taken for 1000 hashes: ' + (helper.getTimestampMillis() - startTime))
                console.log('Final hash = ' + hashes[hashes.length - 1])
                return hashes
            },
            getRandomNumber: (length) => {
                return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
            },
            getExistingChannelItem: (id) => {
                return <div className="mt-4">
                    <div className="col-8">
                        <p>Channel ID: { id }</p>
                        <p>User: { self.state.existingChannels[id].user }</p>
                        <p>Exists: { self.state.existingChannels[id].exists }</p>
                    </div>
                    <div className="col-4">
                        <button className="btn btn-primary" onClick={() => {
                            self.helpers().joinChannel(id)
                        }}>
                            Join
                        </button>
                    </div>
                </div>
            },
            joinChannel: (id) => {
                let aesKey = helper.getWeb3().sha3(id)
                helper.getWeb3().eth.sign(helper.getWeb3().eth.defaultAccount, aesKey, (err, sign) => {
                    if (!err) {
                        aesKey = sign
                        if (!this.state.channelContracts[id]) {
                            self.helpers().toggleLoading(true, 'Joining channel..')

                            helper.getContractHelper().getNewSlotsChannelContract(id, (err, contract) => {
                                console.log('getNewSlotsChannelContract: ' + err + ', ' + contract.address + ', ' + aesKey)
                                this.toggleLoading(false, 'Joining channel..')
                                let channelContracts = self.state.channelContracts
                                let address = contract.address
                                channelContracts[address] = contract
                                let activeChannel = {
                                    address: address,
                                    houseSpins: [],
                                    nonce: 1,
                                    aesKey: aesKey
                                }
                                self.setState({
                                    channelContracts: channelContracts,
                                    activeChannel: activeChannel
                                })
                                console.log('initChannelDetails1')
                                self.helpers().initChannelDetails(contract, (err) => {
                                    self.helpers().loadLastSpin(activeChannel)
                                })
                                self.helpers().initChannelWatchers(contract)
                            })
                        } else {
                            console.log('initChannelDetails2')
                            self.helpers().initChannelDetails(self.state.channelContracts[id].address, (err) => {

                            })
                            this.setState({
                                activeChannel: {
                                    address: self.state.channelContracts[id].address
                                }
                            })
                        }
                    }
                })
            },
            leaveChannel: () => {
                self.setState({
                    activeChannel: null
                })
            },
            loadLastSpin: (channel) => {
                console.log('Load last spin: ' + channel.address)
                decentApi.getLastSpin(channel.address, (err, result) => {
                    if (!err) {
                        console.log('loadLastSpin: ' + JSON.stringify(result))
                        let encryptedSpin = result.userSpin
                        let houseSpin = result.houseSpin
                        let nonce = result.nonce + 1
                        let userSpin, houseSpins
                        if (encryptedSpin) {
                            let aesKey = channel.aesKey
                            try {
                                userSpin = JSON.parse(cryptoJs.AES.decrypt(encryptedSpin, aesKey)
                                    .toString(cryptoJs.enc.Utf8))
                            } catch (e) {

                            }
                        }
                        if (houseSpin)
                            houseSpins = [houseSpin]
                        else
                            houseSpins = []
                        console.log('Loaded spin: ' + nonce + ', ' + JSON.stringify(houseSpins) + ', ' + JSON.stringify(userSpin))
                        let activeChannel = self.state.activeChannel
                        activeChannel.nonce = nonce
                        activeChannel.houseSpins = houseSpins
                        activeChannel.lastSpinLoaded = true
                        self.setState({
                            activeChannel: activeChannel
                        })
                    } else {
                        console.log('Error loading spin: ' + err)
                    }
                })
            },
            initChannelDetails: (channelContract, cb) => {
                async.parallel({
                    allowance: (callback) => {
                        self.web3Getters().channelAllowance(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    finalUserHash: (callback) => {
                        self.web3Getters().finalUserHash(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    finalReelHash: (callback) => {
                        self.web3Getters().finalReelHash(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    finalReelSeedHash: (callback) => {
                        self.web3Getters().finalReelSeedHash(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    ready: (callback) => {
                        self.web3Getters().ready(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    activated: (callback) => {
                        self.web3Getters().activated(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    initialDeposit: (callback) => {
                        self.web3Getters().initialDeposit(channelContract, (err) => {
                            callback(false)
                        })
                    },
                    initialUserNumber: (callback) => {
                        self.web3Getters().initialUserNumber(channelContract, (err) => {
                            callback(false)
                        })
                    }
                }, (err, results) => {
                    console.log('initChannelDetails: ' + err + ', ' + JSON.stringify(results))
                    cb(false)
                })
            },
            initChannelWatchers: (contract) => {
                self.watchers().activateChannel(contract)
            },
            depositToChannel: () => {
                if (!self.state.activeChannel.ready) {

                    let deposit = () => {
                        let initialRandomNumber = self.helpers().getInitialRandomNumber()
                        userHashes = self.helpers().getUserHashes(initialRandomNumber)
                        const finalHash = userHashes[userHashes.length - 1]
                        let account = helper.getContractHelper().getWeb3().eth.defaultAccount

                        console.log('Depositing with initialRandomNumber: ' + initialRandomNumber +
                            ', initialUserNumber: ' + initialUserNumber +
                            ', final hash:' + finalHash + ', ' + typeof initialUserNumber)

                        self.helpers().getChannelContract().deposit.sendTransaction(initialUserNumber, finalHash, {
                            from: account,
                            gas: 3000000
                        }).then((tx) => {

                            console.log('Deposited amount to channel ' + self.state.activeChannel.address +
                                ' by user ' + account + ': ' +
                                helper.fixLargeNumber(self.state.activeChannel.depositAmount) +
                                ' with initial number: ' + initialUserNumber)

                        }).catch((err) => {
                            console.log('Error depositing to channel: ' + err)
                        })
                    }

                    console.log('Allowance: ' + self.state.activeChannel.allowance +
                        ', ' + self.state.activeChannel.depositAmount)

                    if (self.state.activeChannel.allowance < self.state.activeChannel.depositAmount) {
                        /**
                         * Approve deposit amount on token contract before depositing to channel
                         * */
                        helper.getContractHelper().getWrappers().token()
                            .approve(self.state.activeChannel.address,
                                self.state.activeChannel.depositAmount).then((tx) => {
                            console.log('Successfully approved deposit amount: ' + tx)
                            deposit()
                        }).catch((err) => {

                            console.log('Error approving deposit amount: ' + err)

                        })
                    } else
                        deposit()
                }
            },
            closeChannel: () => {
                let betSize = ethUnits.units.ether
                betSize = self.helpers().fixBigNumber(betSize)
                self.helpers().getSpin(betSize, (err, spin) => {
                    if (!err) {
                        let priorSpin = self.state.activeChannel.houseSpins
                            [self.state.activeChannel.houseSpins.length - 1]

                        console.log('House spin: ' + JSON.stringify(priorSpin))
                        console.log('Curr spin sign: ' + spin.sign)

                        helper.getContractHelper().getWrappers().slotsChannel(self.helpers().getChannelContract())
                            .finalize(spin, priorSpin)
                            .then((sha3Hash) => {
                                console.log('Is sign address equal: ' + JSON.stringify(sha3Hash))
                            }).catch((err) => {
                            console.log('finalize err: ' + err)
                        })
                    } else
                        console.log('Error generating spin: ' + err)
                })
            },
            getChannelContract: () => {
                return self.state.channelContracts[self.state.activeChannel.address]
            },
            validateInitialUserNumber: (initialUserNumber, finalUserHash) => {
                let activeChannel = self.state.activeChannel
                let aesKey = activeChannel.aesKey
                initialUserNumber = cryptoJs.AES.decrypt(initialUserNumber, aesKey).toString(cryptoJs.enc.Utf8)
                console.log('Unencrypted initial user number: ' + initialUserNumber)
                userHashes = self.helpers().getUserHashes(initialUserNumber)
                activeChannel.isValidInitialUserNumber = (userHashes[userHashes.length - 1] == finalUserHash)
                self.setState({
                    activeChannel: activeChannel
                })
            },
            spin: (betSize, callback) => {
                betSize *= ethUnits.units.ether
                betSize = self.helpers().fixBigNumber(betSize)

                let address = self.state.activeChannel.address
                self.helpers().getSpin(betSize, (err, spin) => {
                    if (!err) {
                        decentApi.spin(address, spin, self.state.activeChannel.aesKey, (err, response) => {
                            console.log((err ? 'Error sending spin to house: ' : 'Retrieved result from house: ') +
                                JSON.stringify(response))
                            if (!err) {
                                self.helpers().verifyHouseSpin(response.message, spin, (err, message) => {
                                    if (!err) {
                                        console.log('Valid house spin!')
                                        let activeChannel = self.state.activeChannel
                                        activeChannel.houseSpins.push(response.message)
                                        activeChannel.nonce += 1
                                        self.setState({
                                            activeChannel: activeChannel
                                        })
                                        if (callback) {
                                            let lines = self.helpers().getLines(response.message.reel)
                                            callback(false, response.message, lines)
                                        }
                                    } else {
                                        console.log('Invalid house spin: ' + message)
                                        if (callback)
                                            callback(true, message)
                                    }
                                })
                            } else {
                                if (callback)
                                    callback(true, 'Error retrieving house spin')
                            }
                        })
                    } else {
                        if (callback)
                            callback(true, 'Error generating sign')
                    }
                })
            },
            getSpin: (betSize, callback) => {

                let lastHouseSpin = self.helpers().getHouseSpin(self.state.activeChannel.houseSpins.length - 1)
                let nonce = self.state.activeChannel.nonce

                let reelHash = (nonce == 1) ? self.state.activeChannel.finalReelHash : lastHouseSpin.reelHash
                let reel = ''
                let reelSeedHash = (nonce == 1) ? self.state.activeChannel.finalReelSeedHash : lastHouseSpin.reelSeedHash
                let prevReelSeedHash = (nonce == 1 ) ? '' : lastHouseSpin.prevReelSeedHash
                let userHash = userHashes[userHashes.length - nonce]
                let prevUserHash = userHashes[userHashes.length - nonce - 1]
                let userBalance = ((nonce == 1) ? (self.state.activeChannel.depositAmount) :
                    lastHouseSpin.userBalance)
                let houseBalance = ((nonce == 1) ? (self.state.activeChannel.depositAmount) :
                    lastHouseSpin.houseBalance)

                let spin = {
                    reelHash: reelHash,
                    reel: reel,
                    reelSeedHash: reelSeedHash,
                    prevReelSeedHash: prevReelSeedHash,
                    userHash: userHash,
                    prevUserHash: prevUserHash,
                    nonce: nonce,
                    turn: false,
                    userBalance: userBalance,
                    houseBalance: houseBalance,
                    betSize: betSize
                }

                console.log('Spin solidity sha3: ' + decentApi.getSha3Spin(spin) + ', ' + JSON.stringify(spin))
                console.log('Tightly packed spin: ' + self.helpers().getTightlyPackedSpin(spin))

                decentApi.signString(self.helpers().getTightlyPackedSpin(spin), (err, sign) => {
                    if (!err) {
                        spin.sign = sign.sig
                        console.log('Spin sign: ' + spin.sign)
                        callback(false, spin)
                    } else
                        callback(true)
                })
            },
            /**
             * Returns a tightly packed spin string
             * @param spin
             */
            getTightlyPackedSpin: (spin) => {
                return (spin.reelHash + (spin.reel != '' ? spin.reel.toString() : '') +
                spin.reelSeedHash + spin.prevReelSeedHash + spin.userHash + spin.prevUserHash + spin.nonce + spin.turn +
                spin.userBalance + spin.houseBalance + spin.betSize)
            },
            verifyHouseSpin: (houseSpin, userSpin, callback) => {
                async.waterfall([
                    /**
                     * Verify the spin -> run ecrecover on spin and check whether the address
                     * matches the channel's player address
                     *
                     * @param callback
                     */
                        (callback) => {

                        // Make a copy of houseSpin
                        let nonSignatureSpin = JSON.parse(JSON.stringify(houseSpin))

                        delete nonSignatureSpin.sign

                        let msg = self.helpers().getTightlyPackedSpin(nonSignatureSpin)
                        console.log('Verify house spin: ', msg)
                        let msgHash = helper.getContractHelper().getWeb3().sha3(msg)
                        let sign = houseSpin.sign

                        console.log('\n\n*** PROCESS SPIN - msgHash: ' + msgHash + ', sign: ' + sign + ' ***\n\n')

                        self.helpers().getChannelContract().checkSig.call(msgHash, sign, houseSpin.turn).then((valid) => {
                            console.log('Checksig: ' + valid)
                            if (!valid)
                                callback(true, 'Invalid signature')
                            else
                                callback(null)
                        }).catch((err) => {
                            callback(true, 'Error verifying signature. Please try again')
                        })
                    },
                    /**
                     * Verify spin balances
                     * @param callback
                     */
                        (callback) => {

                        let reel = houseSpin.reel

                        if (userSpin.betSize != houseSpin.betSize) callback(true, 'Invalid betsize')

                        let betSize = parseInt(houseSpin.betSize)
                        let payout = helper.convertToEther(self.helpers().calculateReelPayout(reel, betSize))
                        let userBalance, houseBalance

                        userBalance = (payout == 0) ?
                            (parseInt(userSpin.userBalance) - betSize) :
                            (parseInt(userSpin.userBalance) + payout - betSize)
                        houseBalance = (payout == 0) ?
                            (parseInt(userSpin.houseBalance) + betSize) :
                            (parseInt(userSpin.houseBalance) - payout + betSize)

                        userBalance = self.helpers().fixBigNumber(userBalance)
                        houseBalance = self.helpers().fixBigNumber(houseBalance)

                        console.log('Balances: ' + userBalance + ', ' + houseBalance + '/' +
                            houseSpin.userBalance + ', ' + houseSpin.houseBalance)

                        if (houseSpin.betSize < helper.convertToEther(1) || houseSpin.betSize > helper.convertToEther(5))
                            callback(true, 'Invalid betSize')
                        else if (houseSpin.userBalance != userBalance ||
                            houseSpin.houseBalance != houseBalance)
                            callback(true, 'Invalid balances')
                        else
                            callback(false)
                    },
                    /**
                     * Verify spin hashes
                     * @param callback
                     */
                        (callback) => {
                        if (userSpin.nonce > 1) {
                            console.log(sha256(houseSpin.reelSeedHash + houseSpin.reel.toString()).toString() +
                                ', ' + houseSpin.reelHash)
                            let prevHouseSpin = self.state.activeChannel.houseSpins
                                [self.state.activeChannel.houseSpins.length - 1]
                            if (houseSpin.reelSeedHash != prevHouseSpin.prevReelSeedHash)
                                callback(true, 'Invalid reel seed hash')
                            else if (sha256(houseSpin.prevReelSeedHash).toString() != houseSpin.reelSeedHash)
                                callback(true, 'Invalid reel seed hash')
                            else if (houseSpin.userHash != userSpin.userHash)
                                callback(true, 'Invalid user hash')
                            else if (houseSpin.prevUserHash != userSpin.prevUserHash)
                                callback(true, 'Invalid user hash')
                            else if (sha256(houseSpin.reelSeedHash + houseSpin.reel.toString()).toString()
                                != houseSpin.reelHash)
                                callback(true, 'Invalid reel hash')
                            else
                                callback(false)
                        } else {
                            if (houseSpin.userHash != userSpin.userHash)
                                callback(true, 'Invalid user hash')
                            else if (houseSpin.prevUserHash != userSpin.prevUserHash)
                                callback(true, 'Invalid user hash')
                            else
                                callback(false)
                        }
                    }
                ], (err, result) => {
                    callback(err, result)
                })
            },
            // Get the symbol that matches with a position on a reel
            getSymbol: (reel, position) => {
                if (position == 21)
                    position = 0;
                else if (position == -1)
                    position = 20;
                return slotReels[reel][position]
            },
            // Calculates total payout for NUMBER_OF_LINES lines in the given reel
            calculateReelPayout: (reel, betSize) => {
                betSize = helper.formatEther(betSize)
                let isValid = true
                for (let i = 0; i < reel.length; i++) {
                    if (reel[i] > 20) {
                        isValid = false;
                        break;
                    }
                }
                console.log('calculateReelPayout isValid: ' + isValid)
                if (!isValid) return 0;
                let lines = self.helpers().getLines(reel)
                let totalReward = 0
                console.log('calculateReelPayout lines: ' + JSON.stringify(lines) + ', ' + betSize + ', ' + typeof betSize)
                for (let i = 0; i < betSize; i++)
                    totalReward += (self.helpers().getLineRewardMultiplier(lines[i]))
                console.log('calculateReelPayout totalReward: ' + totalReward)
                return totalReward;
            },
            // Checks if a line is a winning line and returns the reward multiplier
            getLineRewardMultiplier: (line) => {
                console.log('getLineRewardMultiplier: ' + JSON.stringify(line))
                let repetitions = 1
                let rewardMultiplier = 0
                for (let i = 1; i <= line.length; i++) {
                    if (line[i] == line[i - 1])
                        repetitions++
                    else
                        break
                }
                if (repetitions >= 3) {
                    console.log('--- WIN ---')
                    console.log('Repetitions: ' + repetitions)
                    console.log('Line: ' + line[0])
                    console.log('Pay table: ' + paytable[line[0]])
                    rewardMultiplier = paytable[line[0]] * (repetitions - 2)
                    console.log('Reward Multiplier: ' + rewardMultiplier)
                }
                return rewardMultiplier
            },
            // Returns NUMBER_OF_LINES lines containing NUMBER_OF_REELS symbols each
            getLines: (reel) => {
                let lines = [];
                for (let i = 0; i < NUMBER_OF_LINES; i++) {
                    lines.push(self.getLine(i, reel))
                }
                return lines;
            },
            // Returns line for an index
            getLine: (lineIndex, reel) => {
                let line = []
                switch (lineIndex) {
                    case 0:
                        for (let i = 0; i < NUMBER_OF_REELS; i++) {
                            line[i] = self.helpers().getSymbol(i, reel[i])
                        }
                        break
                    case 1:
                        for (let i = 0; i < NUMBER_OF_REELS; i++) {
                            line[i] = self.helpers().getSymbol(i, reel[i] - 1)
                        }
                        break
                    case 2:
                        for (let i = 0; i < NUMBER_OF_REELS; i++) {
                            line[i] = self.helpers().getSymbol(i, reel[i] + 1)
                        }
                        break
                    case 3:
                        for (let i = 0; i < NUMBER_OF_REELS; i++) {
                            if (i == 0 || i == 4)
                                line[i] = self.helpers().getSymbol(i, reel[i] - 1);
                            else if (i == 2)
                                line[i] = self.helpers().getSymbol(i, reel[i] + 1);
                            else
                                line[i] = self.helpers().getSymbol(i, reel[i]);
                        }
                        break
                    case 4:
                        for (let i = 0; i < NUMBER_OF_REELS; i++) {
                            if (i == 0 || i == 4)
                                line[i] = self.helpers().getSymbol(i, reel[i] + 1);
                            else if (i == 2)
                                line[i] = self.helpers().getSymbol(i, reel[i] - 1);
                            else
                                line[i] = self.helpers().getSymbol(i, reel[i]);
                        }
                        break
                    default:
                        break
                }
                return line
            },
            getLastReel: () => {
                let houseSpins = this.state.activeChannel.houseSpins
                if (houseSpins.length == 0)
                    return 'No spins yet..'
                else {
                    const self = this
                    let reel = houseSpins[houseSpins.length - 1].reel
                    let reelString = ''
                    for (let i = 0; i < reel.length; i++) {
                        reelString += self.helpers().getSymbol(i, reel[i])
                        if (i < reel.length - 1)
                            reelString += ', '
                    }
                    return reelString
                }
            },
            fixBigNumber: (number) => {
                let str = '';
                do {
                    let a = number % 10;
                    number = Math.trunc(number / 10);
                    str = a + str;
                } while (number > 0)
                return str;
            },
            // Returns house spin by index
            getHouseSpin: (index) => {
                return self.state.activeChannel.houseSpins[index]
            },
            toggleLoading: (loading, message) => {
                this.setState({
                    loading: loading,
                    message: message
                })
            },
            getBalance: (player) => {
                if (self.state.activeChannel) {
                    if (self.state.activeChannel.nonce == 1)
                        return self.state.activeChannel.depositAmount
                    else {
                        if (self.state.activeChannel.houseSpins &&
                            self.state.activeChannel.houseSpins.length > 0) {
                            // console.log('Active channel: ' + JSON.stringify(self.state.activeChannel))
                            return helper.formatEther(self.helpers().getHouseSpin(self.state.activeChannel.houseSpins.length - 1)
                                [player == PLAYER_USER ? 'userBalance' : 'houseBalance'])
                        }
                        else
                            return 0
                    }
                } else
                    return 0
            }
        }
    }

    watchers = () => {
        const self = this
        return {
            newChannel: () => {
                let newChannelEvent = helper.getContractHelper().getSlotsChannelManagerInstance().NewChannel({}, {
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                newChannelEvent.watch((err, event) => {
                    if (err)
                        console.log('New Channel event error: ' + err)
                    else {
                        if (event.transactionHash == self.state.lastChannelTx) self.helpers().toggleLoading(false)
                        let id = event.args.id
                        let user = event.args.user
                        let initialDeposit = event.args.initialDeposit
                        console.log('New Channel event: ', JSON.stringify(event),
                            id, user, initialDeposit, helper.getWeb3().eth.defaultAccount)
                        if (user == helper.getWeb3().eth.defaultAccount)
                            self.helpers().checkIfChannelExists(id)
                    }
                })
            },
            channelFinalized: () => {
                let channelFinalizedEvent = helper.getContractHelper().getSlotsChannelManagerInstance().ChannelFinalized({}, {
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                channelFinalizedEvent.watch((err, event) => {
                    if (err)
                        console.log('Channel finalized event error: ' + err)
                    else {

                    }
                })
            },
            activateChannel: (contract) => {
                let activateEvent = contract.Activate({}, {toBlock: 'latest'})
                activateEvent.watch((err, event) => {
                    if (!err) {
                        activateEvent.stopWatching((err) => {

                        })
                    }
                })
            }
        }
    }

    web3Getters = () => {
        const self = this
        return {
            channelAllowance: (channelContract, callback) => {
                let user = helper.getWeb3().eth.defaultAccount
                helper.getContractHelper().getWrappers().token().allowance(helper.getWeb3().eth.defaultAccount,
                    channelContract.address).then((allowance) => {
                    console.log('Allowance for ' + channelContract.address + 'from ' + user + ': ' + allowance)
                    let activeChannel = self.state.activeChannel
                    activeChannel.allowance = allowance
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error retrieving allowance for : ' + channelContract.address + ', ' + err)
                    callback(true)
                })
            },
            finalUserHash: (channelContract, callback) => {
                let user = helper.getWeb3().eth.defaultAccount
                channelContract.finalUserHash().then((finalUserHash) => {
                    console.log('Final user hash: ' + finalUserHash)
                    let activeChannel = self.state.activeChannel
                    activeChannel.finalUserHash = finalUserHash
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error retrieving finalUserHash for : ' + channelContract.address + ', ' + err)
                    callback(true)
                })
            },
            finalReelHash: (channelContract, callback) => {
                const self = this
                channelContract.finalReelHash().then((finalReelHash) => {
                    console.log('Final reel hash: ' + finalReelHash)
                    let activeChannel = self.state.activeChannel
                    activeChannel.finalReelHash = finalReelHash
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error retrieving finalReelHash for : ' + channelContract.address + ', ' + err)
                    callback(true)
                })
            },
            finalReelSeedHash: (channelContract, callback) => {
                channelContract.finalSeedHash().then((finalReelSeedHash) => {
                    console.log('Final reel seed hash: ' + finalReelSeedHash)
                    let activeChannel = self.state.activeChannel
                    activeChannel.finalReelSeedHash = finalReelSeedHash
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error retrieving finalReelSeedHash for : ' + channelContract.address + ', ' + err)
                    callback(true)
                })
            },
            ready: (channelContract, callback) => {
                let user = helper.getWeb3().eth.defaultAccount
                channelContract.ready.call().then((ready) => {
                    console.log('isChannelReady: ' + ready)
                    let activeChannel = self.state.activeChannel
                    activeChannel.ready = ready
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error checking if user is ready: ' + err)
                    callback(true)
                })
            },
            activated: (channelContract, callback) => {
                channelContract.activated.call().then((activated) => {
                    console.log('isChannelActivated: ' + activated)
                    let activeChannel = self.state.activeChannel
                    activeChannel.activated = activated
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error checking if channel has activated: ' + err)
                    callback(true)
                })
            },
            initialDeposit: (channelContract, callback) => {
                let user = helper.getWeb3().eth.defaultAccount
                channelContract.initialDeposit().then((amount) => {
                    console.log('Amount to deposit to channel ' + self.state.activeChannel.address + ' by user ' + user +
                        ': ' + helper.fixLargeNumber(amount))
                    let activeChannel = self.state.activeChannel
                    activeChannel.depositAmount = helper.fixLargeNumber(amount)
                    self.setState({
                        activeChannel: activeChannel
                    })
                    callback(false)
                }).catch((err) => {
                    console.log('Error retrieving deposited amount to channel: ' + err)
                    callback(true)
                })
            },
            initialUserNumber: (channelContract, callback) => {
                let user = helper.getWeb3().eth.defaultAccount
                channelContract.initialUserNumber().then((initialUserNumber) => {
                    console.log('Successfully retrieved initial user number: ' + initialUserNumber +
                        ', ' + typeof initialUserNumber)
                    let activeChannel = self.state.activeChannel
                    activeChannel.initialUserNumber = initialUserNumber
                    self.setState({
                        activeChannel: activeChannel
                    })
                    self.helpers().validateInitialUserNumber(initialUserNumber, activeChannel.finalUserHash)
                    callback(false)
                }).catch((err) => {
                    console.log('Error retrieving initial user number: ' + err)
                    callback(true)
                })
            }
        }
    }

    web3Setters = () => {
        return {
            token: () => {
                return {
                    faucet: () => {
                        helper.getContractHelper().getWrappers().token().faucet().then((tx) => {
                            console.log('Successfully retrieved dbets: ' + tx)
                        }).catch((err) => {
                            console.log('Error retrieving dbets: ' + err)
                        })
                    }
                }
            }
        }
    }

    render = () => {
        const self = this
        return (
            <div className="slots-channel">
                <h1>Slots Channel</h1>
                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-primary" onClick={() => {
                            if (self.state.activeChannel)
                                self.helpers().leaveChannel()
                            else
                                self.helpers().createChannel()
                        }}>{self.state.activeChannel ? "Leave channel" : "Create Channel"}
                        </button>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary "
                                onClick={() => {
                                    self.web3Setters().token().faucet()
                                }}>Get DBETs
                        </button>
                    </div>
                </div>
                {   self.state.loading &&
                <Loading message={self.state.message}/>
                }
                {   !self.state.loading &&
                <div>
                    {   !self.state.activeChannel &&
                    <div>
                        {   Object.keys(self.state.existingChannels).length > 0 &&
                        <div className="row mt-5">
                            {   Object.keys(self.state.existingChannels).map((id) => {
                                return self.helpers().getExistingChannelItem(id)
                            })}
                        </div>
                        }
                    </div>
                    }
                    {   self.state.activeChannel &&
                    <div style={{marginTop: 50}}>
                        <h4>Channel: { self.state.activeChannel.address }</h4>
                        <div className="row mt-4">
                            <div className="col-2 offset-6">
                                <button className={ "btn btn-primary " +
                                (!self.state.activeChannel.ready ? '' : 'disabled')
                                }
                                        onClick={() => {
                                            self.helpers().depositToChannel()
                                        }}>Deposit
                                </button>
                            </div>
                            <div className="col-2">
                                <button className="btn btn-primary"
                                        onClick={() => {
                                            self.helpers().closeChannel()
                                        }}>
                                    Close Channel
                                </button>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-4">
                                <h4>Activated</h4>
                                {   self.state.activeChannel.hasOwnProperty('activated') &&
                                <p>{ self.state.activeChannel.activated ? 'Yes' : 'No' }</p>
                                }
                                {   !self.state.activeChannel.hasOwnProperty('activated') &&
                                <p>Loading..</p>
                                }
                            </div>
                            <div className="col-4">
                                <h4>Ready</h4>
                                {   self.state.activeChannel.hasOwnProperty('ready') &&
                                <p>{ self.state.activeChannel.ready ? 'Yes' : 'No'}</p>
                                }
                                {   !self.state.activeChannel.hasOwnProperty('ready') &&
                                <p>Loading..</p>
                                }
                            </div>
                            <div className="col-4">
                                <h4>Deposit Amount</h4>
                                {   self.state.activeChannel.hasOwnProperty('depositAmount') &&
                                <p>{ Math.round(self.state.activeChannel.depositAmount / helper.getEtherInWei()) + ' DBETs' }</p>
                                }
                                {   !self.state.activeChannel.hasOwnProperty('depositAmount') &&
                                <p>Loading..</p>
                                }
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4">
                                <h4>Valid Hash?</h4>
                                {   self.state.activeChannel.hasOwnProperty('initialUserNumber') &&
                                self.state.activeChannel.hasOwnProperty('finalUserHash') &&
                                <p>{ self.state.activeChannel.isValidInitialUserNumber ? 'Valid' : 'Invalid'}</p>
                                }
                                {   !self.state.activeChannel.hasOwnProperty('initialUserNumber') ||
                                !self.state.activeChannel.hasOwnProperty('finalUserHash') &&
                                <p>Loading..</p>
                                }
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-4">
                                <button className={"btn btn-primary ml-2 " +
                                ((!self.state.activeChannel.activated || !self.state.activeChannel.ready) ? 'btn-disabled' : '') }
                                        onClick={() => {
                                            self.helpers().spin(1)
                                        }}>
                                    Spin (Bet 1)
                                </button>
                            </div>
                            <div className="col-4">
                                <button className={"btn btn-primary ml-2 " +
                                ((!self.state.activeChannel.activated || !self.state.activeChannel.ready) ? 'btn-disabled' : '') }
                                        onClick={() => {
                                            self.helpers().spin(5)
                                        }}>
                                    Spin (Bet 5)
                                </button>
                            </div>
                            <div className="col-4">
                                <button className={"btn btn-primary ml-2 " +
                                ((!self.state.activeChannel.activated || !self.state.activeChannel.ready) ? 'btn-disabled' : '') }
                                        onClick={() => {
                                            self.helpers().spin(10)
                                        }}>
                                    Spin (Bet 10)
                                </button>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
                                <h4 className="text-center">Last reel: { self.helpers().getLastReel() }</h4>
                            </div>
                            <div className="col-4">
                                <p className="text-center">User balance:
                                    { self.helpers().getBalance(PLAYER_USER) + ' DBETs'}</p>
                            </div>
                            <div className="col-4">
                                <p className="text-center">House balance:
                                    { self.helpers().getBalance(PLAYER_HOUSE) + ' DBETs'}</p>
                            </div>
                        </div>
                        {   self.state.activeChannel.lastSpinLoaded &&
                        <div className="row mt-4">
                            <Iframe
                                id="slots-iframe"
                                url={ process.env.PUBLIC_URL + '/slots-game' }
                                width="900px"
                                height="600px"
                                display="initial"
                                position="relative"
                                allowFullScreen/>
                        </div>
                        }
                    </div>
                    }
                </div>
                }
            </div>
        )
    }


}

export default SlotsChannel