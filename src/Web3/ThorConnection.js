import { thorify } from 'thorify'
import Web3 from 'web3'
import KeyHandler from './KeyHandler'
import ContractHelper from './ContractHelper'
import { PROVIDER_LOCAL, PROVIDER_DBET, KEY_GETH_PROVIDER } from '../Components/Constants'

const keyHandler = new KeyHandler()

export class ThorConnection {

    static buildThor() {
        let providerUrl = ThorConnection.getProviderUrl()
        window._thor = thorify(new Web3(), providerUrl)
        let address = keyHandler.getAddress()
        window._thor.eth.defaultAccount = (address && address.length > 0) ? address : ''
        ThorConnection.contractFactory()
    }

    static setCredentials(privateKey, address) {
        keyHandler.set(privateKey, address)
        ThorConnection.thor().eth.defaultAccount = address
    }

    static setDefaultAccount(account) {
        ThorConnection.thor().eth.defaultAccount = account
    }

    static getDefaultAccount() {
        return ThorConnection.thor().eth.defaultAccount
    }

    
    static buildContracts() {
        ThorConnection.contractFactory().buildContracts()
        ThorConnection.thor().eth.accounts.wallet.add(keyHandler.get())
    }

    /**
     * Get the thor instance
     * @returns {thorify} 
     */
    static thor() {
        if (!window._thor) {
            ThorConnection.buildThor()
        }
        
        return window._thor
    }

    /**
     * Get the contract factory instance
     * @returns {ContractHelper} 
     */
    static contractFactory() {
        if(!window._contractFactory) {
            window._contractFactory = new ContractHelper(null, ThorConnection.thor())
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
