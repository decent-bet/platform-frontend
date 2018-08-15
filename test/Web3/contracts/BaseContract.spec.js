import { thorify } from 'thorify'
import { JsonContracts } from '../../../src/Web3/JsonContracts'
import KeyHandler from '../../../src/Web3/KeyHandler'
import BaseContract from '../../../src/Web3/contracts/BaseContract'
const Web3 = require('web3')

jest.mock('web3')
jest.mock('../../../src/Web3/KeyHandler')

const _dummyProviderUrl = 'http://localhost:1234'
let instance
let baseContract
let keyHandler
let web3

beforeAll(() => {
    KeyHandler.mockClear()
    Web3.mockClear()
    localStorage.clear()

    web3 = thorify(new Web3(), _dummyProviderUrl)
    const { BettingProviderContract } = JsonContracts 
    instance = new web3.eth.Contract(BettingProviderContract.abi)
    keyHandler = new KeyHandler()
    
    keyHandler.get = jest.fn()
    keyHandler.getAddress = jest.fn()
    keyHandler.get.mockReturnValue('x0r41431431431241313413241324')
    baseContract = new BaseContract(web3, instance, keyHandler)
 })

describe('BaseContract', () => { 

    test('should call constructor', () => {
        baseContract = new BaseContract(web3, instance, keyHandler)
        expect(baseContract._web3).not.toBeUndefined()
        expect(baseContract.instance).not.toBeUndefined()
        expect(baseContract._keyHandler).not.toBeUndefined()
    })

    test('should call signAndSendRawTransaction', () => {
        baseContract.signAndSendRawTransaction().then((promiEvent) => {
            expect(web3.eth.accounts.signTransaction).toHaveBeenCalled()
            expect(web3.eth.sendSignedTransaction).toHaveBeenCalled()
            expect(promiEvent.once).toHaveBeenCalled()
        })
    })

    test('should call getBalance', () => {
        baseContract.getBalance('1234577677878').then(() => {
            expect(web3.eth.getBalance).toHaveBeenCalled()
        })
    })
    
})

