class NonceHandler {

    /**
     * Caches the last nonce
     */
    set = (nonce) => {
        localStorage.setItem('nonce', nonce)
    }

    /**
     * Returns the next nonce based on the last nonce returned by getTransactionCount()
     */
    get = (txCount) => {
        let cachedNonce = localStorage.getItem('nonce')
        if(!cachedNonce)
            return txCount
        else {
            cachedNonce = parseInt(cachedNonce)
            if(txCount > cachedNonce)
                return txCount
            else
                // Last successful nonce
                return cachedNonce + 1
        }
    }


    /**
     * Clears the cached nonce
     */
    clear = () => {
        localStorage.removeItem('nonce')
    }

}

export default NonceHandler