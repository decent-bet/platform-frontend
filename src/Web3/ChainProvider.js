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
        this.setupThorify()
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
        return ChainProvider.getProviderUrl()
    }
    
    set url(provider) {
        localStorage.setItem(KEY_GETH_PROVIDER, provider)
    }

    static getProviderUrl() {
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
        this.setupThorify()
        this._contractFactory = new ContractFactory(this._web3, this._keyHandler)
    }

    setupThorify() {
        let privateKey = this._keyHandler.get()
        if(privateKey && privateKey.length > 0 ) {
            this._web3.eth.accounts.wallet.add(privateKey)
            this._web3.eth.defaultAccount = this._keyHandler.getAddress()
        }
    }

    static buildThorify(web3, keyHandler) {
        let url = ChainProvider.getProviderUrl()
        let _thorify = thorify(web3, url)
        let privateKey = keyHandler.get()
        if(privateKey && privateKey.length > 0 ) {
            _thorify.eth.accounts.wallet.add(privateKey)
            _thorify.eth.defaultAccount = keyHandler.getAddress()
        }
        return _thorify
    }
}
