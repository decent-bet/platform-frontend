import EventBus from 'eventing-bus'
import Web3 from 'web3'
import KeyHandler from './KeyHandler'
import ContractHelper from './ContractHelper'
import Helper from '../Components/Helper'

const helper = new Helper()
const keyHandler = new KeyHandler()

export default class Web3Loader {
    loopCheckConnection = null

    constructor() {
        let provider = new Web3.providers.WebsocketProvider(
            helper.getGethProvider()
        )

        window.web3Object = new Web3(provider)

        this.checkConnection()
    }

    checkConnection = async () => {
        let connected = false
        try {
            let ret = await window.web3Object.eth.net.isListening()
            if (ret && !connected) {
                console.log('Connected to provider..', helper.getGethProvider())
                await this.proceedIfConnected()
                connected = true
                clearTimeout(this.loopCheckConnection)
            } else {
                console.log('Not connected to provider..')
                EventBus.publish('web3NotLoaded')
                this.loopCheckConnection = setTimeout(
                    this.checkConnection,
                    10000
                )
            }
        } catch (err) {
            console.log('Not connected to provider..', err)
            EventBus.publish('web3NotLoaded')
            this.loopCheckConnection = setTimeout(this.checkConnection, 10000)
        }
    }

    async proceedIfConnected() {
        if (keyHandler.isLoggedIn())
            window.web3Object.eth.defaultAccount = keyHandler.getAddress()
                                                             .toLowerCase()

        const contractHelper = new ContractHelper(window.web3Object)
        await contractHelper.getAllContracts()
        window.contractHelper = contractHelper
        window.web3Loaded = true
        EventBus.publish('web3Loaded')
    }
}