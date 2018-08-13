import { thorify } from 'thorify'
import {
    PROVIDER_LOCAL,
    PROVIDER_DBET,
    KEY_GETH_PROVIDER
} from '../Components/Constants'
import { ContractFactory } from './ContractFactory';

export class ChainProvider {
    /**
     * @var {ContractFactory}
     */
    _contractFactory = null

    /**
     * 
     * @param {Web3} web3 
     * @param {KeyHandler} keyHandler 
     */
    constructor(web3, keyHandler) {
        this._web3 = thorify(web3, this.url)
        this._keyHandler = keyHandler
    }

    /**
     * Get the thorify web3 instance
     * @returns {Web3}
     */
    get web3() {
        return this._web3
    }

    /**
     * Returns the default account
     * @returns {string}
     */
    get defaultAccount() {
        return this._web3.eth.defaultAccount
    }

    /**
     * Get the provider url depending of the environtment
     * @returns {string}
     */
    get url() {
        let provider = localStorage.getItem(KEY_GETH_PROVIDER)
        if (!provider || provider === 'undefined') {
            // In Safari the localStorage returns the text 'undefined' as is
            if (process.env['NODE_ENV'] === 'production') {
                return PROVIDER_DBET
            }
            return PROVIDER_LOCAL
        }

        return provider
    }
    
    set url(provider) {
        localStorage.setItem(KEY_GETH_PROVIDER, provider)
    }

    /**
     * Configure the web3 instance 
     * @returns {void}
     */
    get contractFactory() {
            if (!this._contractFactory) {
                this.buildContractFactory()
            }
    
            return this._contractFactory
    }

    /**
     * Setup the contract factory
     */
    buildContractFactory() {
        let privateKey = this._keyHandler.get()
        if(!privateKey || privateKey.length <= 0 ) {
            throw new Error('Private key not available')
        }
        this._web3.eth.accounts.wallet.add(privateKey)
        this._web3.eth.defaultAccount = this._keyHandler.getAddress()
        this._contractFactory = new ContractFactory(this._web3, this._keyHandler)
    }
}
