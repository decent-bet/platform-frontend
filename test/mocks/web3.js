export const mockWeb3 = {
    eth: {
        defaultAccount: '0x',
        getTransactionCount: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(10)
            })
        }),
        sendSignedTransaction: jest.fn(() => {
            return { once: jest.fn() }
        }),
    }
}
