class NonceHandler {

    /**
     * Caches the last nonce
     */
    _set = (nonce) => {
        localStorage.setItem('nonce', nonce)
    }

    /**
     * Returns the next nonce based on the last nonce returned by getTransactionCount()
     */
    get = (txCount) => {
        let cachedNonce = localStorage.getItem('nonce') == null ? null : parseInt(localStorage.getItem('nonce'))

        if(cachedNonce != null) {
            if(cachedNonce < txCount)
                cachedNonce = txCount
            else
                cachedNonce = cachedNonce + 1
        } else
            cachedNonce = txCount

        this._set(cachedNonce)
        return cachedNonce
    }


    /**
     * Clears the cached nonce
     */
    clear = () => {
        localStorage.removeItem('nonce')
    }

}

export default NonceHandler