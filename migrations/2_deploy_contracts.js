let utils = require("../test/utils/utils.js")
utils.setWeb3(web3)

let MultiSigWallet = artifacts.require("MultiSigWallet")
let DecentBetToken = artifacts.require("DecentBetToken")
let UpgradeAgent = artifacts.require("UpgradeAgent")
let DecentBetVault = artifacts.require("DecentBetVault")
let House = artifacts.require("House")
let BettingProvider = artifacts.require("BettingProvider")
let BettingProviderHelper = artifacts.require("BettingProviderHelper")
let SportsOracle = artifacts.require("SportsOracle")

let ECVerify = artifacts.require("ECVerify")
let GameChannelManager = artifacts.require("GameChannelManager")
let SlotsChannel = artifacts.require("SlotsChannel")
let SlotsHelper = artifacts.require("SlotsHelper")

module.exports = function (deployer, network) {
    let decentBetMultisig
    let upgradeMaster, agentOwner
    let startBlock, endBlock
    let accounts = web3.eth.accounts.slice(0, 3)
    let signaturesRequired = 2
    let token, wallet, upgradeAgent, house, bettingProvider, bettingProviderHelper, sportsOracle,
        gameChannelManager, ecVerify, sportsBetting, slots, slotsHelper
    console.log('Network: ' + network + ', startBlock: ' + web3.eth.blockNumber)
    if (network == 'testnet' || network == 'development') {
        deployer.deploy(MultiSigWallet, accounts, signaturesRequired).then(function (instance) {
            wallet = instance
            upgradeMaster = web3.eth.accounts[0]
            agentOwner = upgradeMaster
            decentBetMultisig = MultiSigWallet.address
            startBlock = web3.eth.blockNumber + 2
            endBlock = web3.eth.blockNumber + 20000
            return deployer.deploy(DecentBetToken, decentBetMultisig, upgradeMaster, startBlock, endBlock)
        }).then(function (instance) {
            return DecentBetToken.deployed()
        }).then(function (instance) {
            token = instance
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
            sportsBetting = instance
            console.log('House: ' + web3.eth.accounts[0])
            return deployer.deploy(SportsOracle)
        }).then(function () {
            return SportsOracle.deployed()
        }).then(function (instance) {
            sportsOracle = instance
            return deployer.deploy(ECVerify)
        }).then(function (instance) {
            ecVerify = instance
            return deployer.link(ECVerify, GameChannelManager)
        }).then(function () {
            console.log('Linked ecverify to GameChannelManager')
            return deployer.deploy(SlotsHelper)
        }).then(function () {
            return SlotsHelper.deployed()
        }).then(function (instance) {
            console.log('Deployed Slots Helper')
            slotsHelper = instance
            console.log('Deploying GameChannelManager with token: ' + token.address + ', slotsHelper: ' +
                slotsHelper.address + ' and ' + web3.eth.accounts[0])
            return deployer.deploy(GameChannelManager, token.address, slotsHelper.address, web3.eth.accounts[0])
        }).then(function (instance) {
            gameChannelManager = instance
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