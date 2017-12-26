const CryptoJS = require('crypto-js')

class KeyHandler {

    /**
     * Caches a private key
     */
    set = (key, address) => {
        localStorage.setItem('key', key)
        localStorage.setItem('address', address)
    }

    /**
     * Returns private key of the logged in user
     */
    get = () => {
        return localStorage.getItem('key')
    }

    /**
     * Returns address of the logged in user
     */
    getAddress = () => {
        return localStorage.getItem('address')
    }


    /**
     * Clears the logged in keys
     */
    clear = () => {
        localStorage.clear()
    }

    isLoggedIn = () => {
        return (localStorage.getItem('key') != null)
    }

}

export default KeyHandler