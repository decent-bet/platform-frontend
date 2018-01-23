/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import EventBus from 'eventing-bus'
import Web3 from 'web3'

import KeyHandler from './KeyHandler'
import ContractHelper from '../ContractHelper'

const constants = require('../Constants')
const keyHandler = new KeyHandler()

let initWeb3 = () => {
    const providerURI = constants.PROVIDER_URL

    let provider = new Web3.providers.WebsocketProvider(providerURI)
    let loopCheckConnection

    window.web3Object = new Web3(provider)

    let proceedIfConnected = () => {
        if (keyHandler.isLoggedIn())
            window.web3Object.eth.defaultAccount = keyHandler.getAddress().toLowerCase()

        const contractHelper = new ContractHelper()
        contractHelper.getAllContracts((err, token) => {
            window.contractHelper = contractHelper
            window.web3Loaded = true
            EventBus.publish('web3Loaded')
        })
    }

    let checkConnection = () => {
        console.log('Checking for provider connection..')
        window.web3Object.eth.net.isListening().then((ret) => {
            if (ret) {
                console.log('Connected to provider..')
                proceedIfConnected()
                clearTimeout(loopCheckConnection)
            } else {
                console.log('Not connected to provider..')
                EventBus.publish('web3NotLoaded')
                loopCheckConnection = setTimeout(checkConnection, 10000)
            }
        })
    }

    checkConnection()
}

class Web3Loader {

    constructor() {
        initWeb3()
    }

    init() {
        initWeb3()
    }

}

export default Web3Loader