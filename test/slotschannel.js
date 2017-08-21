/**
 * Created by user on 8/17/2017.
 */
let utils = require("./utils/utils.js")
utils.setWeb3(web3)

const GameChannelManager = artifacts.require('GameChannelManager')
const SlotsChannel = artifacts.require('SlotsChannel')

const initialDeposit = 1000000000000000000

contract('GameChannelManager', (accounts) => {
    // TODO: Create tests for creating, depositing and activate a channel
    let gameChannelManager
    it('Deploys SlotsChannel', () => {
        return GameChannelManager.deployed().then((instance) => {
            gameChannelManager = instance
            console.log('Get house')
            return gameChannelManager.house.call()
        }).then((house) => {
            console.log('House', house)
            console.log('Get token')
            return gameChannelManager.token.call()
        }).then((token) => {
            console.log('Token', token)
            console.log('Get slots helper')
            return gameChannelManager.slotsHelper.call()
        }).then((slotsHelper) => {
            console.log('Slots Helper', slotsHelper, typeof initialDeposit)
            return gameChannelManager.createSlotsChannel(initialDeposit, {gas: 4000000})
        }).then((tx) => {
            console.log('Created slots channel', tx)
        })
    })
})