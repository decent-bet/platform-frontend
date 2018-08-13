import HouseSessionsContract from '../../../src/Web3/contracts/HouseSessionsContract';
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
          
        })
      })
    }
  })
})

describe('HouseSessionsContract', () => {
  let web3 = null
  let contract = null

  beforeAll(async () => {
    web3 = new Web3()
    contract = new HouseSessionsContract(web3)
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

})
