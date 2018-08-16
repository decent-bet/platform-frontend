export const mockWallet = {
    add: jest.fn()
}

export const mockContract = {
    options: {
        address: jest.fn()
    }
}

export const mockgetChainTag = jest.fn(async () => {
    return Promise.resolve({
        'x7032': {
            address: 'x0123456789'
        }
    })
})

export const mockEth = {
    defaultAccount: '0x',

    accounts: {
        wallet: mockWallet
    },

    getBlockNumber: jest.fn(),

    getBalance: jest.fn(),

    getStorageAt: jest.fn(),

    getCode: jest.fn(),

    Contract: function() {
        return mockContract
    },

    getBlock: jest.fn(),

    getTransaction: jest.fn(),

    getTransactionReceipt: jest.fn(),

    sendTransaction: jest.fn(),

    sendSignedTransaction: jest.fn(),

    call: jest.fn(),

    estimateGas: jest.fn(),

    getPastLogs: jest.fn(),

    getEnergy: jest.fn(),
    
    getChainTag: jest.fn(() => {
        return Promise.resolve({
            '0': {
                address: '0xc7'
            }
        })
    }),

    getBlockRef: jest.fn()
}

const thorify = jest
    .fn()
    .mockImplementation(
        () => {
            return {
                eth: mockEth,
                utils: jest.fn()
            }
        }
    )

export { thorify }
