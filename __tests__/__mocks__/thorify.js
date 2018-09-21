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
        signTransaction: jest.fn(() => {
            return Promise.resolve({
                rawTransaction: '9u9345932u58935u42u525u2435'
            })
        }),
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

    getChainTag: jest.fn(() => {
        return Promise.resolve({
            '0': {
                address: '0xc7'
            }
        })
    }),
    
    getTransaction: jest.fn(),

    getTransactionReceipt: jest.fn(),

    sendTransaction: jest.fn(),

    sendSignedTransaction: jest.fn(),

    call: jest.fn(),

    estimateGas: jest.fn(),

    getPastLogs: jest.fn(),

    getEnergy: jest.fn(),

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
