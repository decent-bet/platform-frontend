
import Actions, { Prefix } from './actionTypes'
import { createActions } from 'redux-actions'
import { Wallet } from 'ethers'
import KeyHandler from '../../Web3/KeyHandler'

const keyHandler = new KeyHandler()

async function login(data) {
    let wallet
    if (data.includes(' ')) {
        // Passphrase Mnemonic mode
        wallet = Wallet.fromMnemonic(data)
    } else {
        // Private Key Mode
        // Adds '0x' to the beginning of the key if it is not there.
        if (data.substring(0, 2) !== '0x') {
            data = '0x' + data
        }

        wallet = new Wallet(data)
    }

    keyHandler.set(wallet.privateKey, wallet.address)
    return true
}

async function logout() {
    keyHandler.clear()
    return false //authenticated false
}

async function getProviderUrl(chainProvider) {
    return chainProvider.providerUrl
}

function setProviderUrl(chainProvider, url) {
    chainProvider.providerUrl = url
}

export default createActions({
    [Prefix]: {
        [Actions.LOGIN]: login,
        [Actions.LOGOUT]: logout,
        [Actions.GET_PROVIDER_URL]: getProviderUrl,
        [Actions.SET_PROVIDER_URL]: setProviderUrl
    }
})


