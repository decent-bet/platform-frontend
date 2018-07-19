import async from 'async'
import ethUtil from 'ethereumjs-util'

// New Contract Objects
import BettingProviderContract from './contracts/BettingProviderContract'
import DecentBetTokenContract from './contracts/DecentBetTokenContract'
import HouseAuthorizedContract from './contracts/HouseAuthorizedContract'
import HouseContract from './contracts/HouseContract'
import HouseController from './contracts/HouseController'
import HouseFundsContract from './contracts/HouseFundsContract'
import HouseLotteryContract from './contracts/HouseLotteryContract'
import HouseSessionsContract from './contracts/HouseSessionsContract'
import SlotsChannelFinalizerContract from './contracts/SlotsChannelFinalizerContract'
import SlotsChannelManagerContract from './contracts/SlotsChannelManagerContract'
import SportsOracleContract from './contracts/SportsOracleContract'

export default class ContractHelper {
    /**
     *
     * @param {Web3} web3Param
     */
    constructor(web3Param) {
        this.web3 = web3Param

        // Initialize new Contracts
        this.bettingProviderContract = new BettingProviderContract(this.web3)
        this.decentBetTokenContract = new DecentBetTokenContract(this.web3)
        this.houseAuthorizedContract = new HouseAuthorizedContract(this.web3)
        this.houseContract = new HouseContract(this.web3)
        this.houseFundsContract = new HouseFundsContract(this.web3)
        this.houseLotteryContract =  new HouseLotteryContract(this.web3)
        this.houseSessionsContract =  new HouseSessionsContract(this.web3)
        this.slotsChannelFinalizerContract =  new SlotsChannelFinalizerContract(this.web3)
        this.SlotsChannelManager = new SlotsChannelManagerContract(this.web3)
        this.sportsOracleContract =  new SportsOracleContract(this.web3, this.decentBetTokenContract)
        
        this.houseController =  new HouseController(this.web3,
                                               this.houseContract,
                                               this.houseSessionsContract,
                                               this.houseFundsContract,
                                               this.houseAuthorizedContract,
                                               this.houseLotteryContract)
    }

    getAllContracts = callback => {
        async.parallel(
            {
                token: callback => {
                    this.decentBetTokenContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                house: callback => {
                    this.houseContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                houseAuthorizedController: callback => {
                    this.houseAuthorizedContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                houseFundsController: callback => {
                    this.houseFundsContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                houseLotteryController: callback => {
                    this.houseLotteryContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                houseSessionsController: callback => {
                    this.houseSessionsContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                bettingProvider: callback => {
                    this.bettingProviderContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                slotsChannelManager: callback => {
                    this.SlotsChannelManager.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                slotsChannelFinalizer: callback => {
                    this.slotsChannelFinalizerContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                },
                sportsOracle: callback => {
                    this.sportsOracleContract.deployed().then(_instance =>
                        callback(null, _instance)
                    )
                }
            },
            (err, results) => {
                callback(false, results)
            }
        )
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            token: () => {
                return self.decentBetTokenContract
            },
            house: () => {
                return self.houseController
            },
            bettingProvider: () => {
                return self.bettingProviderContract
            },
            sportsOracle: () => {
                return self.sportsOracleContract
            },
            slotsChannelFinalizer: () => {
                return self.slotsChannelFinalizerContract
            },
            slotsChannelManager: () => {
                return self.SlotsChannelManager
            }
        }
    }

    verifySign = (msg, sign, address) => {
        let sigParams = ethUtil.fromRpcSig(sign)
        let msgHash = ethUtil.sha3(msg)

        let r = sigParams.r
        let s = sigParams.s
        let v = ethUtil.bufferToInt(sigParams.v)

        let publicKeyBuffer = ethUtil.ecrecover(msgHash, v, r, s)
        let publicKey = ethUtil.bufferToHex(publicKeyBuffer)
        publicKey = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKey))

        console.log(
            'Verify sign - Public key',
            publicKey,
            publicKey === address
        )

        return publicKey === address
    }
}
