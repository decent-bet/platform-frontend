let utils = require("./utils/utils.js")

let MultiSigWallet = artifacts.require("MultiSigWallet")
let DecentBetToken = artifacts.require('TestDecentBetToken')
let House = artifacts.require('House')
let HouseLottery = artifacts.require('HouseLottery')
let BettingProvider = artifacts.require('BettingProvider')
let BettingProviderHelper = artifacts.require('BettingProviderHelper')

let wallet
let token
let house
let houseLottery
let bettingProviderHelper

let slots
let bettingProvider
let newBettingProvider

let founder
let nonFounder

const ERROR_VM_EXCEPTION_REVERT = 'VM Exception while processing transaction: revert'

contract('House', (accounts) => {
    it('initializes house contract', () => {
        founder = accounts[0]
        nonFounder = accounts[1]
        return MultiSigWallet.deployed()
            .then((instance) => {
                wallet = instance
                return DecentBetToken.deployed()
            }).then((instance) => {
                token = instance
                return House.deployed()
            }).then((instance) => {
                house = instance
                return house.founder()
            }).then((_founder) => {
                assert.equal(founder, _founder, 'Invalid founder');
                return house.decentBetToken()
            }).then((tokenAddress) => {
                assert.equal(token.address, tokenAddress, 'Invalid token address in house')
            })
    })

    it('disallows non-founders from adding authorized addresses', () => {
        return house.addToAuthorizedAddresses.sendTransaction(nonFounder, {from: nonFounder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Adding authorized address from non-founders should throw an out of gas exception.'
                )
            })
    })

    it('allows founder to add authorized addresses', () => {
        return house.addToAuthorizedAddresses.sendTransaction(nonFounder, {from: founder})
            .then(() => {
                return house.authorized.call(nonFounder)
            }).then((authorized) => {
                assert.equal(authorized, true, 'Founder could not add authorized address')
            })
    })

    it('disallows non-founders from setting lottery contract address', () => {
        return HouseLottery.deployed()
            .then((instance) => {
                houseLottery = instance
                return house.setHouseLotteryAddress.sendTransaction(houseLottery.address, {from: nonFounder})
            })
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Setting lottery contract address from non-founders should throw an exception.'
                )
            })
    })

    it('sets lottery contract address as a founder', () => {
        return house.setHouseLotteryAddress.sendTransaction(houseLottery.address, {from: founder})
            .then(() => {
                return house.houseLottery()
            }).then((_lotteryAddress) => {
                assert.equal(houseLottery.address, _lotteryAddress, 'Founder could not set lottery contract address')
            })
    })

    it('disallows non-founders from removing authorized addresses', () => {
        return house.removeFromAuthorizedAddresses.sendTransaction(nonFounder, {from: nonFounder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Removing authorized addresses as a non-founder should throw an exception.'
                )
            })
    })

    it('allows founder to remove authorized addresses', () => {
        return house.removeFromAuthorizedAddresses.sendTransaction(nonFounder, {from: founder})
            .then((tx) => {
                return house.authorized.call(nonFounder)
            }).then((authorized) => {
                assert.equal(authorized, false, 'Founder could not remove authorized address')
            })
    })

    it('disallows non-founders from adding house offerings', () => {
        let newOffering
        return BettingProviderHelper.deployed()
            .then((instance) => {
                bettingProviderHelper = instance
                return BettingProvider.new(token.address, house.address, bettingProviderHelper.address)
            }).then((instance) => {
                newOffering = instance
                return house.addHouseOffering(newOffering.address, {from: nonFounder})
            })
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Adding house offerings as a non-founder should throw an exception.'
                )
            })
    })

    it('disallows founders from adding non house offerings as house offerings', () => {
        let nonOffering = nonFounder
        return house.addHouseOffering(nonOffering, {from: founder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Adding non-house offerings as a founder should throw an exception.'
                )
            })
    })

    it('allows founders to add house offerings', () => {
        return BettingProvider.new(token.address, house.address, bettingProviderHelper.address)
            .then((instance) => {
                newBettingProvider = instance
                return house.addHouseOffering(newBettingProvider.address, {from: founder})
            }).then((tx) => {
                return house.doesOfferingExist(newBettingProvider.address)
            }).then((exists) => {
                assert.equal(exists, true, 'House offering could not be added as a founder')
            })
    })

    it('disallows users from purchasing credits before session zero', () => {
        return house.purchaseCredits(1)
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Purchasing credits before session zero should throw an exception.'
                )
            })
    })

    it('disallows non-authorized addresses from beginning session zero', () => {
        return house.beginNextSession({from: nonFounder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Beginning session zero as an unauthorized address should throw an exception.'
                )
            })
    })

    it('allows authorized addresses to begin session zero', () => {
        return house.beginNextSession({from: founder})
            .then(() => {
                return house.sessionZeroStartTime()
            }).then((startTime) => {
                assert.notEqual(startTime, 0, 'Authorized addresses are not able to begin session zero')
            })
    })

    it('disallows users from purchasing house credits if they do not have a DBET balance', () => {
        const creditsToPurchase = '1000000000000000000000'
        return house.purchaseCredits(creditsToPurchase, {from: nonFounder}).then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Purchasing credits without a DBET balance should throw an exception.'
                )
            })
    })

    it('allows users to purchase house credits if they have a DBET balance', () => {
        const creditsToPurchase = '1000000000000000000000'
        let currentSession, nextSession
        return house.currentSession().then((session) => {
            currentSession = session.toNumber()
            nextSession = currentSession + 1
            return token.faucet({from: nonFounder})
        }).then(() => {
            return token.approve(house.address, creditsToPurchase, {from: nonFounder})
        }).then(() => {
            return house.purchaseCredits(creditsToPurchase, {from: nonFounder})
        }).then(() => {
            return house.getUserCreditsForSession(nextSession, nonFounder)
        }).then((userCredits) => {
            let sessionCredits = userCredits[0].toFixed()
            assert.equal(sessionCredits, creditsToPurchase, 'Invalid house credits for user')
        })
    })

    it('disallows users from liquidating house credits when it isn\'t a profit distribution period', () => {
        let currentSession
        return house.currentSession()
            .then((session) => {
                currentSession = session
                return house.getUserCreditsForSession(currentSession, nonFounder)
            }).then((userCredits) => {
                let sessionCredits = userCredits[0].toFixed()
                return house.liquidateCredits(currentSession, sessionCredits)
            }).then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Liquidating credits when it isn\'t a profit distribution period should throw an exception.'
                )
            })
    })

    it('disallows users from rolling over credits when it isn\'t a profit distribution period', () => {
        let currentSession
        return house.currentSession()
            .then((session) => {
                currentSession = session
                return house.getUserCreditsForSession(currentSession, nonFounder)
            }).then((userCredits) => {
                let sessionCredits = userCredits[0]
                return house.rollOverCredits(sessionCredits)
            }).then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Rolling over credits when it isn\'t a profit distribution period should throw an exception.'
                )
            })
    })

    it('disallows founders from withdrawing previous session tokens from house offerings during session zero', () => {
        return BettingProvider.deployed()
            .then((instance) => {
                bettingProvider = instance
                return house.withdrawPreviousSessionTokensFromHouseOffering(bettingProvider.address)
            }).then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Withdrawing previous session tokens from hosue offerings during session zero should throw an exception.'
                )
            })
    })

    it('disallows unauthorized addresses from allocating tokens for house offerings', () => {
        const percentageAllocation = 50
        return house.allocateTokensForHouseOffering(percentageAllocation, bettingProvider.address, {from: nonFounder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Allocating tokens for house offerings as a non-authorized address should throw an exception.'
                )
            })
    })

    it('disallows authorized addresses from allocating more than 100% of tokens to house offerings', () => {
        const percentageAllocation = 101
        return house.allocateTokensForHouseOffering(percentageAllocation, bettingProvider.address, {from: founder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Allocating more than 100% of tokens should throw an exception.'
                )
            })
    })

    it('allows authorized addresses to allocate tokens for house offerings', () => {
        const percentageAllocation = 50
        let nextSession
        return house.allocateTokensForHouseOffering(percentageAllocation, bettingProvider.address, {from: founder})
            .then(() => {
                house.allocateTokensForHouseOffering(percentageAllocation, newBettingProvider.address, {from: founder})
            }).then(() => {
                return house.currentSession()
            }).then((session) => {
                nextSession = session.toNumber() + 1
                return house.getOfferingTokenAllocations(nextSession, bettingProvider.address)
            }).then((tokenAllocation) => {
                let allocation = tokenAllocation[0].toNumber()
                assert.equal(allocation, percentageAllocation,
                    'Authorized addresses should be able to allocate tokens for house offerings')
                return house.getOfferingTokenAllocations(nextSession, newBettingProvider.address)
            }).then((tokenAllocation) => {
                let allocation = tokenAllocation[0].toNumber()
                assert.equal(allocation, percentageAllocation,
                    'Authorized addresses should be able to allocate tokens for house offerings')
            })
    })

    it('disallows authorized addresses from depositing allocated tokens to house offerings ' +
        'before the last week of session zero', () => {
        return house.depositAllocatedTokensToHouseOffering(bettingProvider.address, {from: founder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Depositing allocated tokens to house offerings before the last week of session ' +
                    'zero should throw an exception.'
                )
            })
    })

    it('disallows unauthorized addresses from depositing allocated tokens to house offerings', () => {
        return house.sessionZeroStartTime().then((startTime) => {
            startTime = startTime.toNumber()
            const oneWeek = (7 * 24 * 60 * 60)
            let lastWeekTime = startTime + oneWeek
            return house.setTime(lastWeekTime, {from: founder})
        }).then(() => {
            return house.depositAllocatedTokensToHouseOffering(bettingProvider.address, {from: nonFounder})
        }).then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Depositing allocated tokens to house offerings during the last week of session ' +
                    'zero as an unauthorized address should throw an exception.'
                )
            })
    })

    it('allows authorized addresses to deposit allocated tokens to house offerings', () => {
        let nextSession
        return house.depositAllocatedTokensToHouseOffering(bettingProvider.address, {from: founder})
            .then(() => {
                return house.depositAllocatedTokensToHouseOffering(newBettingProvider.address, {from: founder})
            }).then(() => {
                return house.currentSession()
            }).then((session) => {
                nextSession = session.toNumber() + 1
                return house.getOfferingTokenAllocations(nextSession, bettingProvider.address)
            }).then((tokenAllocation) => {
                let deposited = tokenAllocation[1]
                assert.equal(deposited, true,
                    'Authorized addresses should be able to allocate deposited tokens to house offerings')
                return house.getOfferingTokenAllocations(nextSession, newBettingProvider.address)
            }).then((tokenAllocation) => {
                let deposited = tokenAllocation[1]
                assert.equal(deposited, true,
                    'Authorized addresses should be able to allocate deposited tokens to house offerings')
            })
    })

    it('disallows unauthorized addresses from beginning session one', () => {
        return house.beginNextSession({from: nonFounder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Beginning session one as an unauthorized address should throw an exception'
                )
            })
    })

    it('disallows authorized addresses to begin session one before the end of session zero', () => {
        return house.beginNextSession({from: founder})
            .then(assert.fail)
            .catch(function (error) {
                assert.include(
                    error.message,
                    ERROR_VM_EXCEPTION_REVERT,
                    'Beginning session one as an authorized address before the end of session zero ' +
                    'should throw an exception'
                )
            })
    })

    it('allows authorized addresses to begin session one after the end of session zero', () => {
        let currentSession
        return house.currentSession()
            .then((session) => {
                currentSession = session.toNumber()
                console.log('Check: currentSession', currentSession)
                return house.sessionZeroStartTime()
            }).then((startTime) => {
                startTime = startTime.toNumber()
                const oneWeek = (7 * 24 * 60 * 60)
                let endOfSessionTime = startTime + (oneWeek * 2)
                console.log('Check: setTime', startTime, endOfSessionTime)
                return house.setTime(endOfSessionTime, {from: founder})
            }).then(() => {
                console.log('Check: beginNextSession')
                return house.beginNextSession({from: founder})
            }).then(() => {
                console.log('Check: currentSession')
                return house.currentSession()
            }).then((session) => {
                let nextSession = session.toNumber()
                console.log('Check: currentSession', nextSession, currentSession)
                assert.equal(currentSession, (nextSession - 1),
                    'Authorized addresses should be able to begin session one at the end of session zero')
            })
    })


})