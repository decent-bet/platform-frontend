import EthAccounts from 'web3-eth-accounts'
import AbstractContract from '../../src/Web3/contracts/AbstractContract'
import Web3 from 'web3'
import Helper from '../../src/Components/Helper'
import TruffleContract from 'truffle-contract'
import { mockTruffleContract } from '../mocks/truffleContract'
import { mockWeb3 } from '../mocks/web3'

jest.mock('web3-eth-accounts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            signTransaction: async function() {
                return {
                    rawTransaction: ''
                }
            }
        }
    })
})
jest.mock('truffle-contract', () => {
    return jest.fn().mockImplementation(() => {
        return mockTruffleContract
    })
})
jest.mock('web3', () => {
    return jest.fn().mockImplementation(() => {
        return mockWeb3
    })
})
jest.mock('../../src/Components/Helper', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getGethProvider: () => {
                return ''
            }
        }
    })
})

beforeEach(() => {
    EthAccounts.mockClear()
    Helper.mockClear()
    TruffleContract.mockClear()
})

it('should call constructor', () => {
    const web3 = new Web3()
    const abstractContract = new AbstractContract(web3, {})
    expect(abstractContract.contract.setProvider).toHaveBeenCalledTimes(1)
})

it('should call contract.deployed', () => {
    const web3 = new Web3()
    const abstractContract = new AbstractContract(web3, { abi: 1 })
    abstractContract.contract.deployed()
    expect(abstractContract.contract.deployed).toHaveBeenCalledTimes(1)
})

it('should call contract.signAndSendRawTransaction', () => {
    const web3 = new Web3()
    const abstractContract = new AbstractContract(web3, { abi: 1 })
    abstractContract.signAndSendRawTransaction().then((promiEvent) => {
        expect(web3.eth.getTransactionCount).toHaveBeenCalled()
        expect(web3.eth.sendSignedTransaction).toHaveBeenCalled()
        expect(promiEvent.once).toHaveBeenCalled()
    })
})
