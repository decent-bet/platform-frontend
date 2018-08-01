import EthAccounts from 'web3-eth-accounts'
import BaseContract from './BaseContract'
import Web3 from 'web3'
import Helper from '../../../src/Components/Helper'
import TruffleContract from 'truffle-contract'

jest.mock('../../../src/Components/Helper')

beforeEach(() => {
    EthAccounts.mockClear()
    Helper.mockClear()
    TruffleContract.mockClear()
})

it('should call constructor', () => {
    const web3 = new Web3()
    const abstractContract = new BaseContract(web3, {})
    expect(abstractContract.contract.setProvider).toHaveBeenCalledTimes(1)
})

it('should call contract.deployed', () => {
    const web3 = new Web3()
    const abstractContract = new BaseContract(web3, { abi: 1 })
    abstractContract.contract.deployed()
    expect(abstractContract.contract.deployed).toHaveBeenCalledTimes(1)
})

it('should call contract.signAndSendRawTransaction', () => {
    const web3 = new Web3()
    const abstractContract = new BaseContract(web3, { abi: 1 })
    abstractContract.signAndSendRawTransaction().then((promiEvent) => {
        expect(web3.eth.getTransactionCount).toHaveBeenCalled()
        expect(web3.eth.sendSignedTransaction).toHaveBeenCalled()
        expect(promiEvent.once).toHaveBeenCalled()
    })
})
