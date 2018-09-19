import { thorify } from 'thorify'
import { ContractFactory } from './ContractFactory';
import { webSocket } from 'rxjs/webSocket'
import { getConfig } from '../config'

export class ChainProvider {
    /**
     * @var {ContractFactory}
     */
    _contractFactory = null
    _web3 = null
    /**
     * 
     * @param {Web3} web3 
     * @param {KeyHandler} keyHandler 
     */
    constructor(web3, 
                keyHandler) {
        this._rawWeb3 = web3
        this._keyHandler = keyHandler
    }

    /**
     * Get the thorify web3 instance
     * @returns {Web3}
     */
    get web3() {
        if(this._web3 === null) {
            this._web3 = thorify(this._rawWeb3, this.providerUrl)
        }
        return this._web3
    }

    get keyHandler() {
        return this._keyHandler
    }

    /**
     * Returns the default account
     * @returns {string}
     */
    get defaultAccount() {
        return this._keyHandler.getAddress()
    }

    /**
     * Get the provider url depending of the environtment
     * @returns {string}
     */
    get providerUrl() {
        let stage = this._keyHandler.getStage()
        let config = getConfig(stage)
        return config.thorNode
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
        this._contractFactory = new ContractFactory(this._web3, this._keyHandler)
    }

    async setupThorify(address, privateKey) {

        if(address && privateKey) {
            this.web3.eth.accounts.wallet.add(privateKey)
            this.web3.eth.defaultAccount = address
        } else if(this._keyHandler.isLoggedIn()) {
            let { privateKey } = await this._keyHandler.get()
            console.log('this.web3', this.web3)
            if(privateKey && privateKey.length > 0 ) {
                this.web3.eth.accounts.wallet.add(privateKey)
                this.web3.eth.defaultAccount = this._keyHandler.getAddress()
            }   
        }
    }
}
