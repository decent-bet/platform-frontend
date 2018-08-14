import { ContractFactory } from '../../src/Web3/ContractFactory'
import KeyHandler from '../../src/Web3/KeyHandler'
import { thorify } from 'thorify'
import { JsonContracts } from '../../src/Web3/JsonContracts'

const Web3 = require('web3')

jest.mock('web3')
jest.mock('../../src/Web3/KeyHandler')

const _dummyProviderUrl = 'http://localhost:1234'

let contractFactory
let keyHandler
let web3

beforeAll(() => {
    KeyHandler.mockClear()
    Web3.mockClear()
    localStorage.clear()

    keyHandler = new KeyHandler()
    web3 = thorify(new Web3(), _dummyProviderUrl)
    keyHandler.get = jest.fn()
    keyHandler.getAddress = jest.fn()
    keyHandler.get.mockReturnValue('x0r41431431431241313413241324')
 })
  
describe('ContractFactyory', () => { 

    beforeEach( () => {
        contractFactory = new ContractFactory(web3, keyHandler)
    })

    test('should call constructor', () => {
        expect(contractFactory).not.toBeUndefined()
        expect(contractFactory._keyHandler).not.toBeUndefined()
        expect(contractFactory._web3).not.toBeUndefined()
    })

    describe('makeContract', () => {
        
        test('should throw an error', async () => {
            expect.assertions(1)
            try {
                await contractFactory.makeContract('NotFoundContract')
              } catch (e) {
                expect(e).toEqual(
                    new Error('Json contract doesn\'t exists for the name given: NotFoundContract')
                )
              }
        })

        test('should return a valid Contract', async () => {
            expect.assertions(2)
            const { BettingProviderContract } = JsonContracts 
            const [ chainTag ] = Object.keys(BettingProviderContract.chain_tags)
            contractFactory._web3.eth.getChainTag.mockResolvedValue(chainTag)
            const contract = await contractFactory.makeContract('BettingProviderContract')
            expect(contract).not.toBeUndefined()
            expect(contract.instance).not.toBeUndefined()
        })
    })

    describe('getChainTagObject', () => {
        test('should be equal to the chain tag from BettingProviderContract', async () => {
            expect.assertions(1)
            const { BettingProviderContract } = JsonContracts 
            const [ chainTag ] = Object.keys(BettingProviderContract.chain_tags)
            const chainTagObject = BettingProviderContract.chain_tags[chainTag]
            contractFactory._web3.eth.getChainTag.mockResolvedValue(chainTag)
            let resultChainTag = await contractFactory.getChainTagObject(BettingProviderContract)
            expect(resultChainTag).toBe(chainTagObject)
        })
    })

    describe('Contracts', () => {

        describe('bettingProviderContract', () => {
            test('should return a BettingProviderContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('BettingProviderContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('BettingProviderContract')
            })

            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('BettingProviderContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('houseAuthorizedContract', () => {
            test('should return a HouseAuthorizedContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('HouseAuthorizedContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('HouseAuthorizedContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('HouseAuthorizedContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('houseContract', () => {
            test('should return a HouseContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('HouseContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('HouseContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('HouseContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('houseFundsContract', () => {
            test('should return a HouseFundsContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('HouseFundsContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('HouseFundsContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('HouseFundsContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('houseLotteryContract', () => {
            test('should return a HouseLotteryContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('HouseLotteryContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('HouseLotteryContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('HouseLotteryContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('houseSessionsContract', () => {
            test('should return a HouseSessionsContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('HouseSessionsContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('HouseSessionsContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('HouseSessionsContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('slotsChannelFinalizerContract', () => {
            test('should return a SlotsChannelFinalizerContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('SlotsChannelFinalizerContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('SlotsChannelFinalizerContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('SlotsChannelFinalizerContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('SlotsChannelManagerContract', () => {
            test('should return a SlotsChannelManagerContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('SlotsChannelManagerContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('SlotsChannelManagerContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('SlotsChannelManagerContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('decentBetTokenContract', () => {
            test('should return a DecentBetTokenContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('DecentBetTokenContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('DecentBetTokenContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('DecentBetTokenContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    
        describe('sportsOracleContract', () => {
            test('should return a SportsOracleContract instance', async () => {
                expect.assertions(3)
                const contract = await contractFactory.makeContract('SportsOracleContract')
                expect(contract).not.toBeUndefined()
                expect(typeof contract).not.toBe('Object')
                expect(contract.constructor.name).toBe('SportsOracleContract')
            })
            test('should has an instance property not null or undefined', async () => {
                expect.assertions(2)
                const contract = await contractFactory.makeContract('SportsOracleContract')
                expect(contract.instance).not.toBeUndefined()
                expect(contract.instance).not.toBeNull()
            })
        })
    })

})
