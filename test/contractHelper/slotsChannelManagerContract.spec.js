import SlotsChannelManagerContract from '../../src/Web3/contracts/SlotsChannelManagerContract';
import Web3 from 'web3'
import Helper from '../../src/Components/Helper'
import TruffleContract from 'truffle-contract'
import { mockTruffleContract } from '../mocks/truffleContract'

jest.mock('truffle-contract', () => {
    return jest.fn().mockImplementation(() => {
        return mockTruffleContract
    })
})
jest.mock('web3', () => {
    return jest.fn().mockImplementation(() => {
        return {
            eth: {
                defaultAccount: '0x',
                getTransactionCount: jest.fn(() => {
                    return new Promise((resolve, reject) => {
                        resolve(10)
                    })
                })
            }
        }
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
  Helper.mockClear()
  TruffleContract.mockClear()
});

it('should call constructor', () => {
  const web3 = new Web3()
  const contract = new SlotsChannelManagerContract(web3);
  expect(contract.contract.setProvider).toHaveBeenCalledTimes(1);
});

