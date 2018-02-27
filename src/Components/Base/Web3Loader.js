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
import Helper from '../Helper'

const helper = new Helper()
const keyHandler = new KeyHandler()

let initWeb3 = () => {
    let provider = new Web3.providers.WebsocketProvider(helper.getGethProvider())
    let loopCheckConnection

    window.web3Object = new Web3(provider)

    let proceedIfConnected = () => {
        if (keyHandler.isLoggedIn())
            window.web3Object.eth.defaultAccount = keyHandler.getAddress().toLowerCase()

        const contractHelper = new ContractHelper()
        contractHelper.getAllContracts((err, res) => {
            window.contractHelper = contractHelper
            window.web3Loaded = true
            EventBus.publish('web3Loaded')
        })
    }

    let checkConnection = () => {
        let connected = false
        window.web3Object.eth.net.isListening().then((ret) => {
            if (ret && !connected) {
                console.log('Connected to provider..', helper.getGethProvider())
                proceedIfConnected()
                connected = true
                clearTimeout(loopCheckConnection)
            } else {
                console.log('Not connected to provider..')
                EventBus.publish('web3NotLoaded')
                loopCheckConnection = setTimeout(checkConnection, 10000)
            }
        }).catch((err) => {
            console.log('Not connected to provider..', err.message)
            EventBus.publish('web3NotLoaded')
            loopCheckConnection = setTimeout(checkConnection, 10000)
        })
    }

    checkConnection()
}

class Web3Loader {

    init() {
        initWeb3()
    }

}

export default Web3Loader