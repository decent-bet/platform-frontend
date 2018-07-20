
const mockWeb3 = jest.fn().mockImplementation(() => {
    return {
        eth: {
            defaultAccount: '0x',
            getTransactionCount: jest.fn(() => {
                return new Promise((resolve, reject) => {
                    resolve(10)
                })
            }), sendSignedTransaction: jest.fn(() => {
                return { once: jest.fn() }
            }),
        }
    }
})

export default mockWeb3