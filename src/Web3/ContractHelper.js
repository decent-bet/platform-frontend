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
    constructor(web3Param, thor) {
        this.web3 = thor

        // Initialize new Contracts
        this.bettingProviderContract = new BettingProviderContract(this.web3)
        this.houseAuthorizedContract = new HouseAuthorizedContract(this.web3)
        this.houseContract = new HouseContract(this.web3)
        this.houseFundsContract = new HouseFundsContract(this.web3)
        this.houseLotteryContract = new HouseLotteryContract(this.web3)
        this.houseSessionsContract = new HouseSessionsContract(this.web3)
        this.slotsChannelFinalizerContract = new SlotsChannelFinalizerContract(this.web3)
        this.SlotsChannelManager = new SlotsChannelManagerContract(this.web3)
        this.decentBetTokenContract = new DecentBetTokenContract(this.web3)
        this.sportsOracleContract = new SportsOracleContract(this.web3, this.decentBetTokenContract)

        this.houseController = new HouseController(this.web3,
                                                  this.houseContract,
                                                  this.houseSessionsContract,
                                                  this.houseFundsContract,
                                                  this.houseAuthorizedContract,
                                                  this.houseLotteryContract)
    }

    async getAllContracts() {
        const promises = [this.decentBetTokenContract.deployed(),
                          this.houseContract.deployed(),
                          this.houseAuthorizedContract.deployed(),
                          this.houseFundsContract.deployed(),
                          this.houseLotteryContract.deployed(),
                          this.houseSessionsContract.deployed(),
                          this.bettingProviderContract.deployed(),
                          this.SlotsChannelManager.deployed(),
                          this.slotsChannelFinalizerContract.deployed(),
                          this.sportsOracleContract.deployed()
        ]

        return await Promise.all(promises)
    }

    /** Contract wrappers */
    getWrappers = () => {
        return {
            token: () => {
                return this.decentBetTokenContract
            },
            house: () => {
                return this.houseController
            },
            bettingProvider: () => {
                return this.bettingProviderContract
            },
            sportsOracle: () => {
                return this.sportsOracleContract
            },
            slotsChannelFinalizer: () => {
                return this.slotsChannelFinalizerContract
            },
            slotsChannelManager: () => {
                return this.SlotsChannelManager
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