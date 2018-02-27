const CryptoJS = require('crypto-js')

const DEFAULT_PASSWORD_CHANGE_FOR_MAINNET = '23a6b395e64724e119670503c7d0d763'

class KeyHandler {

    /**
     * Caches a wallet's private key
     */
    set = (key, address, password=DEFAULT_PASSWORD_CHANGE_FOR_MAINNET) => {
        const encryptedKey = CryptoJS.AES.encrypt(key, password).toString()
        localStorage.setItem('key', encryptedKey)
        localStorage.setItem('address', address)
    }

    /**
     * Returns private key of the logged in user
     */
    get = (password=DEFAULT_PASSWORD_CHANGE_FOR_MAINNET) => {
        let privateKey
        try {
            privateKey = CryptoJS.AES
                .decrypt(localStorage.getItem('key'), password)
                .toString(CryptoJS.enc.Utf8)
        } catch (e) {

        }
        return privateKey
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
        localStorage.removeItem('key')
        localStorage.removeItem('address')
        localStorage.removeItem('nonce')
    }

    isLoggedIn = () => {
        return (localStorage.getItem('key') != null)
    }

}

export default KeyHandler