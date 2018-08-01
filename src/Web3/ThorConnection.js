import { thorify } from 'thorify'
import { Wallet } from 'ethers'
import KeyHandler from './KeyHandler'
import { ContractFactory } from './ContractFactory'
import { PROVIDER_LOCAL, PROVIDER_DBET, KEY_GETH_PROVIDER } from '../Components/Constants'
const Web3 = require("web3"); 

const keyHandler = new KeyHandler()

const buildThor = (privateKey, address) => {
        const providerUrl = ThorConnection.getProviderUrl()
        const thor = thorify(new Web3(), providerUrl)
        thor.eth.defaultAccount = address
        thor.eth.defaultAccount = address
        thor.eth.accounts.wallet.add(privateKey)
        window._contractFactory = new ContractFactory(thor)
        window._thor = thor
}

export class ThorConnection {

    /**
     * Setup the web3 thorify instance and authenticate the user
     * @param {string|null} loginValue
     */
    static make(loginValue = null) {

        if ( loginValue === null ) {

            const key = keyHandler.get()
            const address = keyHandler.getAddress()
            if(key && address && key.length > 0 && address.length > 0) {
                buildThor(key, address)
            }

        } else {
            let wallet
            if (loginValue.includes(' ')) {
                // Passphrase Mnemonic mode
                wallet = Wallet.fromMnemonic(loginValue)
            } else {
                // Private Key Mode
                // Adds '0x' to the beginning of the key if it is not there.
                if (loginValue.substring(0, 2) !== '0x') {
                    loginValue = '0x' + loginValue
                }

                wallet = new Wallet(loginValue)
            }

            keyHandler.set(wallet.privateKey, wallet.address)
            buildThor(wallet.privateKey, wallet.address)
        }
    }

    /**
     * Get the default account
     */
    static getDefaultAccount() {
        return ThorConnection.thor().eth.defaultAccount
    }

    /**
     * Get the thorify web3 instance
     * @returns {Web3} 
     */
    static thor() {
        return window._thor
    }

    /**
     * Get the contract factory instance
     * @returns {ContractHelper} 
     */
    static contractFactory() {
        if(!window._contractFactory) {
            window._contractFactory = new ContractFactory(ThorConnection.thor())
        }

        return window._contractFactory
    }

    /**
     * Get the provider url depending of the environtment
     * @returns {string}
     */
    static getProviderUrl() {
        let provider = localStorage.getItem(KEY_GETH_PROVIDER)
        if (!provider || provider === 'undefined') {
            // In Safari the localStorage returns the text 'undefined' as is
            if ( process.env['NODE_ENV'] === 'production' ) {
                return PROVIDER_DBET
            }
            return PROVIDER_LOCAL
        }

        return provider
    }

    static setProviderUrl(provider) {
        localStorage.setItem(KEY_GETH_PROVIDER, provider)
    }

}
