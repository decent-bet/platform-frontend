import HouseContract from '../../../src/Web3/contracts/HouseContract'
import Web3 from 'web3'
import Helper from '../../../src/Components/Helper'
import TruffleContract from 'truffle-contract'
jest.mock('../../../src/Components/Helper')

jest.mock('truffle-contract', () => {
  return jest.fn().mockImplementation(() => {
    return {
      Contract: jest.fn(),
      currentProvider: jest.fn(),
      setProvider: jest.fn(),
      deployed: jest.fn(async () => {
        return Promise.resolve({
          purchaseCredits: {
            sendTransaction: jest.fn(async () => true)
          },
          LogPurchasedCredits: jest.fn(async () => true),
          LogLiquidateCredits: jest.fn(async () => true),
          SendTransaction: jest.fn(async () => true),
          currentSession: jest.fn(async () => true)
        })
      })
    }
  })
})

describe('HouseContract', () => {
  let web3 = null
  let contract = null

  beforeAll(async () => {
    web3 = new Web3()
    contract = new HouseContract(web3)
  })


  beforeEach(() => {
    Helper.mockClear()
    TruffleContract.mockClear()
  })

  test('should call constructor', () => {
    expect(contract.contract.setProvider).toHaveBeenCalledTimes(1);
  })

  test('should set the instance when deployed is called', async () => {
    expect(contract.instance).toBeUndefined();
    let instance = await contract.deployed()
    expect(instance).not.toBeUndefined()
    expect(instance).toEqual(contract.instance)
  })

  test('should call LogPurchasedCredits on instance', () => {
    contract.logPurchasedCredits('sessionNumber', 'fromBlock', 'toBlock')
    expect(contract.instance.LogPurchasedCredits).toHaveBeenCalledTimes(1);
  })

  test('should call purchaseCredits.sendTransaction on instance', () => {
    contract.purchaseCredits(5000)
    expect(contract.instance.purchaseCredits.sendTransaction).toHaveBeenCalledTimes(1);
  })

  test('should call LogLiquidateCredits on instance', () => {
    contract.logLiquidateCredits('sessionNumber', 'fromBlock', 'toBlock')
    expect(contract.instance.LogLiquidateCredits).toHaveBeenCalledTimes(1);
  })

  test('should call getSession on instance', () => {
    contract.getCurrentSession()
    expect(contract.instance.currentSession).toHaveBeenCalledTimes(1);
  })
})