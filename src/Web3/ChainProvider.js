import { thorify } from 'thorify'
import {
    PROVIDER_LOCAL,
    PROVIDER_DBET,
    KEY_GETH_PROVIDER
} from '../Components/Constants'
import KeyHandler from '../Web3/KeyHandler'
import { ContractFactory } from './ContractFactory';
const Web3 = require('web3')

const keyHandler = new KeyHandler()

export class ChainProvider {
    _contractFactory = null

    constructor() {
        this._web3 = thorify(new Web3(), this.url)
    }

    /**
     * Get the thorify web3 instance
     * @returns {Web3}
     */
    get web3() {
        return this._web3
    }

    /**
     * Returns the default account / used instead of web3.eth.defaultAccount
     * @returns {string}
     */
    get defaultAccount() {
        if (!this._contractFactory) {
            this.buildContractFactory()
        }
        return this._web3.eth.accounts.wallet[0].address
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

    buildContractFactory() {
        let privateKey = keyHandler.get()
        if(!privateKey || privateKey.length <= 0 ) {
            throw new Error('Private key not available')
        }
        this._web3.eth.defaultAccount = keyHandler.getAddress()
        this._web3.eth.accounts.wallet.add(privateKey)
        this._contractFactory = new ContractFactory(this._web3)
    }
}
