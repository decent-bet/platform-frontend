import { thorify } from 'thorify'
import { ContractFactory } from './ContractFactory'
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

    async setupThorify(address, privateKey) {
        this._web3 = thorify(this._rawWeb3, this.providerUrl)
        
        if(address && privateKey) {
            this._web3.eth.accounts.wallet.add(privateKey)
            this._web3.eth.defaultAccount = address
        } else if(this._keyHandler.isLoggedIn()) {
            let { privateKey } = await this._keyHandler.get()

            if(privateKey && privateKey.length > 0 ) {
                this._web3.eth.accounts.wallet.add(privateKey)
                this._web3.eth.defaultAccount = this._keyHandler.getAddress()
            }   
        }
    }

    /**
     * Get the thorify web3 instance
     * @returns {Web3}
     */
    get web3() {
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
     * Configure the web3 instance
     * @returns {void}
     */
    get contractFactory() {
            if (this._contractFactory === null) {
                this._contractFactory = new ContractFactory(this._web3, this._keyHandler)
            }

            return this._contractFactory
    }
}
