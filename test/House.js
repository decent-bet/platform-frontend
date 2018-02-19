let utils = require("./utils/utils.js")

let MultiSigWallet = artifacts.require("MultiSigWallet")
let DecentBetToken = artifacts.require('TestDecentBetToken')
let House = artifacts.require('House')
let HouseLottery = artifacts.require('HouseLottery')
let BettingProvider = artifacts.require('BettingProvider')
let BettingProviderHelper = artifacts.require('BettingProviderHelper')
let SlotsChannelManager = artifacts.require('SlotsChannelManager')

let wallet
let token
let house
let houseLottery
let bettingProviderHelper

let slotsChannelManager
let bettingProvider
let newBettingProvider

let founder
let nonFounder

contract('House', (accounts) => {
    it('initializes house contract', async () => {
        founder = accounts[0]
        nonFounder = accounts[1]

        wallet = await MultiSigWallet.deployed()
        token = await DecentBetToken.deployed()
        house = await House.deployed()
        let _founder = await house.founder()
        assert.equal(founder, _founder, 'Invalid founder')

        let houseToken = await house.decentBetToken()
        assert.equal(token.address, houseToken, 'Invalid token address in house')
    })

    it('disallows non-founders from adding authorized addresses', async () => {
        await utils.assertFail(house.addToAuthorizedAddresses.sendTransaction(nonFounder, {from: nonFounder}))
    })

    it('allows founder to add authorized addresses', async () => {
        await house.addToAuthorizedAddresses.sendTransaction(nonFounder, {from: founder})
        let authorized = await house.authorized.call(nonFounder)
        assert.equal(authorized, true, 'Founder could not add authorized address')
    })

    it('disallows non-founders from setting lottery contract address', async () => {
        houseLottery = await HouseLottery.deployed()
        await utils.assertFail(house.setHouseLotteryAddress.sendTransaction(houseLottery.address, {from: nonFounder}))
    })

    it('sets lottery contract address as a founder', async () => {
        await house.setHouseLotteryAddress.sendTransaction(houseLottery.address, {from: founder})
        let lotteryAddress = await house.houseLottery()
        assert.equal(houseLottery.address, lotteryAddress, 'Founder could not set lottery contract address')
    })

    it('disallows non-founders from removing authorized addresses', async () => {
        await utils.assertFail(house.removeFromAuthorizedAddresses.sendTransaction(nonFounder, {from: nonFounder}))
    })

    it('allows founder to remove authorized addresses', async () => {
        await house.removeFromAuthorizedAddresses.sendTransaction(nonFounder, {from: founder})
        let authorized = await house.authorized.call(nonFounder)
        assert.equal(authorized, false, 'Founder could not remove authorized address')
    })

    it('disallows non-founders from adding house offerings', async () => {
        bettingProviderHelper = await BettingProviderHelper.deployed()
        let newOffering = await BettingProvider.new(token.address, house.address, bettingProviderHelper.address)
        await utils.assertFail(house.addHouseOffering(newOffering.address, {from: nonFounder}))
    })

    it('disallows founders from adding non house offerings as house offerings', async () => {
        let nonOffering = nonFounder
        await utils.assertFail(house.addHouseOffering(nonOffering, {from: founder}))
    })

    it('allows founders to add house offerings', async () => {
        newBettingProvider = await BettingProvider.new(token.address, house.address, bettingProviderHelper.address)
        await house.addHouseOffering(newBettingProvider.address, {from: founder})
        let exists = await house.doesOfferingExist(newBettingProvider.address)
        assert.equal(exists, true, 'House offering could not be added as a founder')
    })

    it('disallows users from purchasing credits before session zero', async () => {
        await utils.assertFail(house.purchaseCredits(1))
    })

    it('disallows non-authorized addresses from beginning session zero', async () => {
        await utils.assertFail(house.beginNextSession({from: nonFounder}))
    })

    it('allows authorized addresses to begin session zero', async () => {
        await house.beginNextSession({from: founder})
        let startTime = await house.sessionZeroStartTime()
        assert.notEqual(startTime, 0, 'Authorized addresses are not able to begin session zero')
    })

    it('disallows users from purchasing house credits if they do not have a DBET balance', async () => {
        const creditsToPurchase = '1000000000000000000000'
        await utils.assertFail(house.purchaseCredits(creditsToPurchase, {from: nonFounder}))
    })

    it('allows users to purchase house credits if they have a DBET balance', async () => {
        const creditsToPurchase = '1000000000000000000000'
        let currentSession = await house.currentSession()
        currentSession = currentSession.toNumber()
        let nextSession = currentSession + 1
        await token.faucet({from: nonFounder})
        await token.approve(house.address, creditsToPurchase, {from: nonFounder})
        await house.purchaseCredits(creditsToPurchase, {from: nonFounder})
        let userCredits = await house.getUserCreditsForSession(nextSession, nonFounder)
        let sessionCredits = userCredits[0].toFixed()
        assert.equal(sessionCredits, creditsToPurchase, 'Invalid house credits for user')
    })

    it('disallows users from liquidating house credits when it isn\'t a profit distribution period', async () => {
        let currentSession = await house.currentSession()
        currentSession = currentSession.toNumber()
        let userCredits = await house.getUserCreditsForSession(currentSession, nonFounder)
        let sessionCredits = userCredits[0].toFixed()
        await utils.assertFail(house.liquidateCredits(currentSession, sessionCredits))
    })

    it('disallows users from rolling over credits when it isn\'t a profit distribution period', async () => {
        let currentSession = await house.currentSession()
        currentSession = currentSession.toNumber()
        let userCredits = await house.getUserCreditsForSession(currentSession, nonFounder)
        let sessionCredits = userCredits[0].toFixed()
        await utils.assertFail(house.rollOverCredits(sessionCredits))
    })

    it('disallows founders from withdrawing previous session tokens from house offerings during session zero', async () => {
        bettingProvider = await BettingProvider.deployed()
        await utils.assertFail(house.withdrawPreviousSessionTokensFromHouseOffering(bettingProvider.address, {from: founder}))
    })

    it('disallows unauthorized addresses from allocating tokens for house offerings', async () => {
        const percentageAllocation = 50
        await utils.assertFail(house.allocateTokensForHouseOffering(percentageAllocation, bettingProvider.address,
            {from: nonFounder}))
    })

    it('disallows authorized addresses from allocating more than 100% of tokens to house offerings', async () => {
        const percentageAllocation = 101
        await utils.assertFail(house.allocateTokensForHouseOffering(percentageAllocation, bettingProvider.address,
            {from: nonFounder}))
    })

    it('allows authorized addresses to allocate tokens for house offerings', async () => {
        const providerPercentageAllocation = 40
        await house.allocateTokensForHouseOffering(providerPercentageAllocation, bettingProvider.address, {from: founder})
        await house.allocateTokensForHouseOffering(providerPercentageAllocation, newBettingProvider.address, {from: founder})

        const slotsPercentageAllocation = 20
        slotsChannelManager = await SlotsChannelManager.deployed()
        await house.allocateTokensForHouseOffering(slotsPercentageAllocation, slotsChannelManager.address, {from: founder})

        let currentSession = await house.currentSession()
        currentSession = currentSession.toNumber()
        let nextSession = currentSession + 1

        let providerTokenAllocation = await house.getOfferingTokenAllocations(nextSession, bettingProvider.address)
        let providerAllocation = providerTokenAllocation[0].toNumber()
        assert.equal(providerAllocation, providerPercentageAllocation,
            'Authorized addresses should be able to allocate tokens for house offerings')

        let newProviderTokenAllocation = await house.getOfferingTokenAllocations(nextSession, newBettingProvider.address)
        let newProviderAllocation = newProviderTokenAllocation[0].toNumber()
        assert.equal(newProviderAllocation, providerPercentageAllocation,
            'Authorized addresses should be able to allocate tokens for house offerings')

        let slotsTokenAllocation = await house.getOfferingTokenAllocations(nextSession, slotsChannelManager.address)
        let slotsProviderAllocation = slotsTokenAllocation[0].toNumber()
        assert.equal(slotsPercentageAllocation, slotsProviderAllocation,
            'Authorized addresses should be able to allocate tokens for house offerings')
    })

    it('disallows authorized addresses from depositing allocated tokens to house offerings ' +
        'before the last week of session zero', async () => {
        await utils.assertFail(house.depositAllocatedTokensToHouseOffering(bettingProvider.address, {from: founder}))
    })

    it('disallows unauthorized addresses from depositing allocated tokens to house offerings', async () => {
        let startTime = await house.sessionZeroStartTime()
        startTime = startTime.toNumber()
        const oneWeek = (7 * 24 * 60 * 60)
        let lastWeekTime = startTime + oneWeek

        await house.setTime(lastWeekTime, {from: founder})
        await utils.assertFail(house.depositAllocatedTokensToHouseOffering(bettingProvider.address, {from: nonFounder}))
    })

    it('allows authorized addresses to deposit allocated tokens to house offerings', async () => {
        await house.depositAllocatedTokensToHouseOffering(bettingProvider.address, {from: founder})
        await house.depositAllocatedTokensToHouseOffering(newBettingProvider.address, {from: founder})
        await house.depositAllocatedTokensToHouseOffering(slotsChannelManager.address, {from: founder})

        let currentSession = await house.currentSession()
        currentSession = currentSession.toNumber()
        let nextSession = currentSession + 1

        let providerTokenAllocation = await house.getOfferingTokenAllocations(nextSession, bettingProvider.address)
        let depositedToProvider = providerTokenAllocation[1]
        assert.equal(depositedToProvider, true,
            'Authorized addresses should be able to allocate deposited tokens to house offerings')

        let newProviderTokenAllocation = await house.getOfferingTokenAllocations(nextSession, newBettingProvider.address)
        let depositedToNewProvider = newProviderTokenAllocation[1]
        assert.equal(depositedToNewProvider, true,
            'Authorized addresses should be able to allocate deposited tokens to house offerings')

        let slotsTokenAllocation = await house.getOfferingTokenAllocations(nextSession, slotsChannelManager.address)
        let depositedToSlots = slotsTokenAllocation[1]
        assert.equal(depositedToSlots, true,
            'Authorized addresses should be able to allocate deposited tokens to house offerings')
    })

    it('disallows unauthorized addresses from beginning session one', () => {
        utils.assertFail(house.beginNextSession({from: nonFounder}))
    })

    it('disallows authorized addresses to begin session one before the end of session zero', () => {
        utils.assertFail(house.beginNextSession({from: founder}))
    })

    it('allows authorized addresses to begin session one after the end of session zero', async () => {
        let currentSession = await house.currentSession()
        currentSession = currentSession.toNumber()

        let startTime = await house.sessionZeroStartTime()
        startTime = startTime.toNumber()
        const oneWeek = (7 * 24 * 60 * 60)
        let endOfSessionTime = startTime + (oneWeek * 2)

        await house.setTime(endOfSessionTime, {from: founder})
        await house.beginNextSession({from: founder})
        let nextSession = await house.currentSession()

        assert.equal(currentSession, (nextSession - 1),
            'Authorized addresses should be able to begin session one at the end of session zero')
    })

})