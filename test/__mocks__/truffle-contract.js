const mockTruffleContract = jest.fn().mockImplementation(() => {
    return {
        Contract: jest.fn(),
        currentProvider: jest.fn(),
        setProvider: jest.fn(),
        deployed: jest.fn( async () => {
            return Promise.resolve({})
        })
    }
})

export default mockTruffleContract