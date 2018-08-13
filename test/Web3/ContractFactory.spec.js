import { ContractFactory } from '../../src/Web3/ContractFactory'
import KeyHandler from '../../src/Web3/KeyHandler'
import { thorify } from 'thorify'
import { JsonContracts } from '../../src/Web3/JsonContracts'
import { Contracts } from '../../src/Web3/Contracts'

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

})
