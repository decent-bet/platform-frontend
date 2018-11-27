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
            const { DecentBetTokenContract } = JsonContracts 
            const [ chainTag ] = Object.keys(DecentBetTokenContract.chain_tags)
            contractFactory._web3.eth.getChainTag.mockResolvedValue(chainTag)
            const contract = await contractFactory.makeContract('DecentBetTokenContract')
            expect(contract).not.toBeUndefined()
            expect(contract.instance).not.toBeUndefined()
        })
    })

    describe('getChainTagObject', () => {
        test('should be equal to the chain tag from DecentBetTokenContract', async () => {
            expect.assertions(1)
            const { DecentBetTokenContract } = JsonContracts 
            const [ chainTag ] = Object.keys(DecentBetTokenContract.chain_tags)
            const chainTagObject = DecentBetTokenContract.chain_tags[chainTag]
            contractFactory._web3.eth.getChainTag.mockResolvedValue(chainTag)
            let resultChainTag = await contractFactory.getChainTagObject(DecentBetTokenContract)
            expect(resultChainTag).toBe(chainTagObject)
        })
    })

    describe('Contracts', () => {

        describe('DecentBetTokenContract', () => {
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

    
        describe('SlotsChannelFinalizerContract', () => {
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
    
        describe('DecentBetTokenContract', () => {
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
    })

})
