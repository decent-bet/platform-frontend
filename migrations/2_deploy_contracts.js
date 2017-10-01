let utils = require("../test/utils/utils.js")
utils.setWeb3(web3)

const MultiSigWallet = artifacts.require("MultiSigWallet")
const DecentBetToken = artifacts.require("TestDecentBetToken")
const UpgradeAgent = artifacts.require("TestUpgradeAgent")
const House = artifacts.require("House")
const BettingProvider = artifacts.require("BettingProvider")
const BettingProviderHelper = artifacts.require("BettingProviderHelper")
const SportsOracle = artifacts.require("SportsOracle")

const ECVerify = artifacts.require("ECVerify")
const GameChannelManager = artifacts.require("GameChannelManager")
const SlotsChannel = artifacts.require("SlotsChannel")
const SlotsChannelManager = artifacts.require("SlotsChannelManager")
const SlotsHelper = artifacts.require("SlotsHelper")

module.exports = function (deployer, network) {
    let decentBetMultisig
    let upgradeMaster, agentOwner
    let startTime, endTime
    let accounts = web3.eth.accounts.slice(0, 3)
    let signaturesRequired = 2
    const robotAddress = accounts[0]
    let token, wallet, upgradeAgent, team, house, bettingProvider, bettingProviderHelper, sportsOracle,
        gameChannelManager, ecVerify, slots, slotsHelper, slotsChannelManager
    console.log('Network: ' + network + ', startBlock: ' + web3.eth.blockNumber)
    if (network == 'testnet' || network == 'development') {

        const timestamp = Math.round(new Date().getTime() / 1000)
        deployer.deploy(MultiSigWallet, accounts, signaturesRequired).then(function (instance) {
            wallet = instance
            upgradeMaster = web3.eth.accounts[0]
            team = web3.eth.accounts[0]
            agentOwner = upgradeMaster
            decentBetMultisig = MultiSigWallet.address

            const ethPrice = 300
            const basePrice = ethPrice / 0.125

            startTime = timestamp + (2 * 24 * 60 * 60)
            endTime = timestamp + (28 * 24 * 60 * 60)

            console.log('Deploying DecentBetToken', decentBetMultisig, upgradeMaster, team, basePrice, startTime, endTime)
            return deployer.deploy(DecentBetToken, decentBetMultisig, upgradeMaster,
                team, basePrice, startTime, endTime)
        }).then(function () {
            return DecentBetToken.deployed()
        }).then(function (instance) {
            token = instance
            console.log('Deploying house with token', token.address)
            return deployer.deploy(House, token.address)
        }).then(function (instance) {
            return House.deployed()
        }).then(function (instance) {
            house = instance
            return deployer.deploy(BettingProviderHelper)
        }).then(function () {
            return BettingProviderHelper.deployed()
        }).then(function (instance) {
            bettingProviderHelper = instance
            console.log('Deploying BettingProvider with addresses: ' + token.address + ', ' + house.address)
            return deployer.deploy(BettingProvider, token.address, house.address, bettingProviderHelper.address, {
                gas: 5000000
            })
        }).then(function () {
            return BettingProvider.deployed()
        }).then(function (instance) {
            bettingProvider = instance
            return deployer.deploy(SportsOracle)
        }).then(function () {
            return SportsOracle.deployed()
        }).then(function (instance) {
            sportsOracle = instance
            return deployer.deploy(ECVerify)
        }).then(function () {
            console.log('Linked ecverify to GameChannelManager')
            return deployer.link(ECVerify, SlotsChannelManager)
        }).then(function () {
            console.log('Linked ecverify to SlotsChannelManager')
            return deployer.deploy(SlotsHelper)
        }).then(function () {
            return SlotsHelper.deployed()
        }).then(function (instance) {
            console.log('Deployed Slots Helper')
            slotsHelper = instance
            return deployer.deploy(SlotsChannelManager, house.address, token.address, slotsHelper.address)
        }).then(function () {
            return SlotsChannelManager.deployed()
        }).then(function (instance) {
            console.log('Deployed Slots Channel Manager')
            slotsChannelManager = instance
            // console.log('Deploying GameChannelManager with token: ' + token.address + ', slotsHelper: ' +
            //     slotsHelper.address + ' and ' + web3.eth.accounts[0])
            // return deployer.deploy(GameChannelManager, token.address, slotsHelper.address, web3.eth.accounts[0])
            return house.addHouseOffering.sendTransaction(bettingProvider.address, {
                gas: 3000000
            })
        }).then(function () {
            // gameChannelManager = instance
            return house.addHouseOffering.sendTransaction(slotsChannelManager.address, {
                gas: 3000000
            })
        }).then(function () {
            // gameChannelManager = instance
            return token.setRobot.sendTransaction(robotAddress, {
                gas: 3000000
            })
        }).catch((err) => {
            console.log('Error', err.message)
        })
        /** Won't work until in Success state */
        // .then(function (instance) {
        //     upgradeAgent = instance
        //     return token.setUpgradeAgent(upgradeAgent.address)
        // }).then(function () {
        //     console.log('Successfully setUpgradeAgent')
        // }).catch(function (err) {
        //     console.log('Error: ' + err)
        // }).then(function () {
        //     return deployer.deploy(NewToken, upgradeAgent.address)
        // }).then(function () {
        //     console.log('deployed NEWTOKEN')
        //     return NewToken.deployed()
        // }).then(function (instance) {
        //     newToken = instance
        //     return upgradeAgent.setNewToken(newToken.address)
        // })
    } else if (network == 'mainnet') {
        // check this
        MultiSigWallet.at(utils.multisigWalletAddressMainNet).then(function (instance) {
            wallet = instance
            upgradeMaster = web3.eth.accounts[0]
            agentOwner = upgradeMaster
            decentBetMultisig = MultiSigWallet.address
            startBlock = startBlockMainNet
            endBlock = endBlockMainNet
            return deployer.deploy(DecentBetToken, decentBetMultisig, upgradeMaster, startBlock, endBlock)
        }).then(function (instance) {
            return DecentBetToken.deployed()
        }).then(function (instance) {
            token = instance
            //   functionData = utils.getFunctionEncoding('UpgradeAgent(address)',[token.address])
            //   return web3.eth.estimateGas({data:functionData})
            // }).then(function(gasEstimate){
            //   console.log(gasEstimate)
            gasEstimate = 2000000
            return deployer.deploy(UpgradeAgent, token.address, {
                from: agentOwner,
                gas: gasEstimate + utils.gasEpsilon
            })
        }).then(function () {
            return UpgradeAgent.deployed()
        }).then(function (instance) {
            upgradeAgent = instance
            return token.setUpgradeAgent(upgradeAgent.address)
        })
    }
}