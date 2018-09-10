const CryptoJS = require('crypto-js')
// Todo: Replace next sprint with Webcrypto
const DEFAULT_PASSWORD_CHANGE_FOR_MAINNET = '23a6b395e64724e119670503c7d0d763'

class KeyHandler {
    /**
     * Caches a wallet's private key
     */
    set = ({ vetPubAddress, privateKey, address, password, mnemonic }) => {
        password = password || DEFAULT_PASSWORD_CHANGE_FOR_MAINNET
        const encryptedKey = CryptoJS.AES.encrypt(
            privateKey,
            password
        ).toString()
        localStorage.setItem('vetPubAddress', vetPubAddress)
        localStorage.setItem('key', encryptedKey)
        localStorage.setItem('address', address)

        if (mnemonic) {
            const encryptedMnemonic = CryptoJS.AES.encrypt(
                mnemonic,
                password
            ).toString()
            localStorage.setItem('mnemonic', encryptedMnemonic)
        }
    }

    getPubAddress() {
        let vetPubAddress
        try {
            vetPubAddress = localStorage.getItem('vetPubAddress')
        } catch (e) {
            // log.error(`KeyHandler.js: Error getting private key: ${e.message}`)
        }
        return vetPubAddress
    }
    /**
     * Returns private key and mnemonic of the logged in user
     */
    get = password => {
        password = password || DEFAULT_PASSWORD_CHANGE_FOR_MAINNET
        let privateKey
        let mnemonic
        let vetPubAddress
        try {
            vetPubAddress = localStorage.getItem('vetPubAddress')
            privateKey = CryptoJS.AES.decrypt(
                localStorage.getItem('key'),
                password
            ).toString(CryptoJS.enc.Utf8)

            mnemonic = CryptoJS.AES.decrypt(
                localStorage.getItem('mnemonic'),
                password
            ).toString(CryptoJS.enc.Utf8)
        } catch (e) {
            // log.error(`KeyHandler.js: Error getting private key: ${e.message}`)
        }
        return { mnemonic, privateKey, vetPubAddress }
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
        localStorage.removeItem('mnemonic')        
    }

    isLoggedIn = () => {
        return localStorage.getItem('key') != null
    }
}

export default KeyHandler
