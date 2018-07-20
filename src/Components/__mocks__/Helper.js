const mockHelper = jest.fn().mockImplementation(() => {
    return {
        getGethProvider: () => {
            return 'http://localhost:8545'
        },
        setGethProvider: provider => {
            
        }
    }
})
export default mockHelper