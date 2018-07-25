import Web3 from 'web3'
import Helper from '../../../src/Components/Helper'
import BettingProviderContract from '../../../src/Web3/contracts/BettingProviderContract'
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
                    gamesCount: jest.fn().mockReturnValue(1),
                    getGame: jest.fn().mockReturnValue({})
                })
            })
        }
    })
})

describe('BettingProviderContract', () => {
    let web3 = null
    let contract = null

    beforeAll(async () => {
        web3 = new Web3()
        contract = new BettingProviderContract(web3)
    })

    beforeEach(() => {
        Helper.mockClear()
        TruffleContract.mockClear()
    })

    test('should call constructor', () => {
        expect(contract.contract.setProvider).toHaveBeenCalledTimes(1)
    })

    test('should set the instance when deployed is called', async () => {
        expect(contract.instance).toBeUndefined();
        let instance = await contract.deployed()
        expect(instance).not.toBeUndefined()
        expect(instance).toEqual(contract.instance)
    })

    test('should call the gamesCount instance method ', async () => {
        let count = contract.getGamesCount()
        expect(contract.instance.gamesCount).toHaveBeenCalledTimes(1)
        expect(count).toEqual(1)
    })
    
    test('should call the getGame instance method ', async () => {
       let game = contract.getGame(1)
        expect(contract.instance.getGame).toHaveBeenCalledTimes(1)
        expect(game).not.toBeNull()
    })
})