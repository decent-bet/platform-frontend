const mockWeb3WthAccounts = jest.fn().mockImplementation(() => {
    return {
        signTransaction: async function () {
            return {
                rawTransaction: ''
            }
        }
    }
})

export default mockWeb3WthAccounts