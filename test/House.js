let utils = require("./utils/utils.js")

let MultiSigWallet = artifacts.require("MultiSigWallet")
let DecentBetToken = artifacts.require('TestDecentBetToken')
let House = artifacts.require('House')
let HouseLottery = artifacts.require('HouseLottery')

let wallet
let token
let house
let houseLottery
let slots
let sportsbook

let founder
let nonFounder

contract('House', (accounts) => {
    it('initializes house contract', () => {
        founder = accounts[0]
        nonFounder = accounts[1]
        return MultiSigWallet.deployed().then((instance) => {
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

    it('disallows non-founders to add authorized addresses', () => {
        return House.deployed().then((instance) => {
            house = instance
            return house.addToAuthorizedAddresses.sendTransaction(nonFounder, {from: nonFounder})
        }).then(assert.fail)
          .catch(function (error) {
            console.log('Error', error.message)
            assert.include(
                error.message,
                'VM Exception while processing transaction: revert',
                'Adding authorized address from non-founders should throw an out of gas exception.'
            )
        })
    })

    it('adds authorized address as a founder', () => {
        return House.deployed().then((instance) => {
            house = instance
            return house.addToAuthorizedAddresses.sendTransaction(nonFounder, {from: founder})
        }).then((txId) => {
            return house.authorized.call(nonFounder)
        }).then((authorized) => {
            assert.equal(authorized, true, 'Founder could not add authorized address')
        })
    })

    it('disallows non-founders from setting lottery contract address', () => {
        return House.deployed().then((instance) => {
            house = instance
            return house.setHouseLotteryAddress.sendTransaction(houseLottery.address, {from: nonFounder})
        }).then(assert.fail)
            .catch(function (error) {
                console.log('Error', error.message)
                assert.include(
                    error.message,
                    'VM Exception while processing transaction: revert',
                    'Setting lottery contract address from non-founders should throw an out of gas exception.'
                )
            })
    })

    it('sets lottery contract address as a founder', () => {
        return House.deployed().then((instance) => {
            house = instance
            return house.setHouseLotteryAddress.sendTransaction(houseLottery.address, {from: founder})
        }).then((txId) => {
            return house.houseLottery()
        }).then((_lotteryAddress) => {
            assert.equal(houseLottery.address, _lotteryAddress, 'Founder could not set lottery contract address')
        })
    })

    it('disallows non-founders from removing authorized addresses', () => {

    })

    it('allows founder to remove authorized addresses', () => {

    })

    it('disallows non-founders from adding house offerings', () => {

    })

    it('disallows founders from adding non house offerings as house offerings', () => {

    })

    it('allows founders to add house offerings', () => {

    })

    it('disallows users from purchasing credits before session zero', () => {

    })

    it('disallows authorized addresses from beginning session zero', () => {

    })

    it('allows authorized addresses to begin session zero', () => {

    })

    it('allows authorized addresses to begin session zero', () => {

    })

    it('disallows users from purchasing house credits if they do not have a DBET balance', () => {

    })

    it('allows users to purchase house credits if they have a DBET balance', () => {

    })

    it('allows users to purchase house credits', () => {

    })

    it('disallows users from liquidating house credits when it isn\'t a profit distribution period', () => {

    })

    it('disallows users from rolling over credits when it isn\'t a profit distribution period', () => {

    })

    it('disallows founders from withdrawing previous session tokens from house offerings', () => {

    })

    it('disallows unauthorized addresses from allocating tokens for house offerings', () => {

    })

    it('disallows authorized addresses from allocating more than 100% of tokens to house offerings', () => {

    })

    it('allows authorized addresses to allocate tokens for house offerings', () => {

    })

    it('disallows authorized addresses from depositing allocated tokens to house offerings ' +
        'before the last week of session zero', () => {

    })

    it('disallows unauthorized addresses from depositing allocated tokens to house offerings', () => {

    })

    it('allows authorized addresses to deposit allocated tokens to house offerings', () => {

    })

    it('disallows unauthorized addresses from beginning session one', () => {

    })

    it('allows authorized addresses to begin session one', () => {

    })


})