import { thorify } from 'thorify'
import {
    PROVIDER_LOCAL,
    PROVIDER_DBET,
    KEY_GETH_PROVIDER
} from '../Components/Constants'
import { ContractFactory } from './ContractFactory';
import { webSocket } from 'rxjs/webSocket'

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
        this._rawWeb3 = web3
        this._web3 = thorify(web3, this.providerUrl)
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
    get providerUrl() {
        let url = localStorage.getItem(KEY_GETH_PROVIDER)
        if (!url || url === 'undefined') {
            // In Safari the localStorage returns the text 'undefined' as is
            if (process.env['NODE_ENV'] === 'production') {
                url = PROVIDER_DBET
            } else {
                url = PROVIDER_LOCAL
            }
        }

        localStorage.setItem(KEY_GETH_PROVIDER, url)
        
        return url
    }

    /**
     * Return the url for websocket connections
     * 
     * @returns {string}
     */
    get wsProviderUrl() {
        let baseUrl = new URL(this.providerUrl)
        baseUrl.protocol = baseUrl.protocol === 'https:' ? 'wss:' : 'ws:'
        return baseUrl
    }

    /**
     * 
     * @param {string} path 
     * @returns {WebSocketSubject}
     */
    makeWebSocketConnection(path) {
        let baseUrl = this.wsProviderUrl
        return webSocket(`${baseUrl}${path}`)
    }

    /**
    * Set the provider url
     * @returns {string}
     */
    set providerUrl(url) {
        localStorage.setItem(KEY_GETH_PROVIDER, url)
        this._web3 = thorify(this._rawWeb3, url)
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
        let { privateKey } = this._keyHandler.get()
        if(privateKey && privateKey.length > 0 ) {
            this._web3.eth.accounts.wallet.add(privateKey)
            this._web3.eth.defaultAccount = this._keyHandler.getAddress()
        }
    }
}
