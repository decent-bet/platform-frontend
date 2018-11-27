import {
    PROVIDER_LOCAL
} from 'src/common/Constants'
import { ContractFactory } from '../../src/Web3/ContractFactory'
import { ChainProvider } from '../../src/Web3/ChainProvider'
import KeyHandler from '../../src/Web3/KeyHandler'
const Web3 = require('web3')

jest.mock('web3')
jest.mock('../../src/Web3/KeyHandler')

const _dummyProviderUrl = 'http://localhost:1234'
const _defaultAddress = 'x01234567890'
let chainProvider
let keyHandler
let web3

beforeAll(() => {
    KeyHandler.mockClear()
    Web3.mockClear()

    keyHandler = new KeyHandler()
    web3 = new Web3()
    keyHandler.get = jest.fn()
    keyHandler.getAddress = jest.fn(()=> _defaultAddress)
    keyHandler.get.mockReturnValue('x0r41431431431241313413241324')
 })
  
describe('ChainProvider', () => { 

    beforeEach( () => {
        chainProvider = new ChainProvider(web3, keyHandler)
    })

    test('should call constructor', () => {
        expect(chainProvider).not.toBeUndefined()
        expect(chainProvider._keyHandler).not.toBeUndefined()
        expect(chainProvider._web3).not.toBeUndefined()
    })

    describe('url', () => {
        
        test('should return the local url', () => {
            expect(chainProvider.url).toBe(PROVIDER_LOCAL)
        })
    })

    describe('contractFactory', () => {
        test('should return a contract factory instance', () => {
            expect(chainProvider.contractFactory).not.toBeNull()
            expect(chainProvider.contractFactory).toBeInstanceOf(ContractFactory)
        })
    })

    describe('settings in web3', () => {
        test('should set defaultAccount', () => {
            expect(chainProvider.defaultAccount).toBe(_defaultAddress)
        })
    })
})
