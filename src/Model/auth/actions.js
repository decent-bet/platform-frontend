
import Actions, { Prefix } from './actionTypes'
import { createActions } from 'redux-actions'
import { Wallet } from 'ethers'
import KeyHandler from '../../Web3/KeyHandler'

const keyHandler = new KeyHandler()

async function login(data) {
    let wallet
    if (data.includes(' ')) {
        // Passphrase Mnemonic mode
        const vetWallet = Wallet.fromMnemonic(data, "m/44'/818'/0'/0")
        keyHandler.set({
            vetPubAddress: vetWallet.address,
            mnemonic: data,
            privateKey: vetWallet.privateKey,
            address: vetWallet.address,
        })
    } else {
        // Private Key Mode
        // Adds '0x' to the beginning of the key if it is not there.
        if (data.substring(0, 2) !== '0x') {
            data = '0x' + data
        }

        wallet = new Wallet(data)
        keyHandler.set({
            vetPubAddress: wallet.address,
            privateKey: wallet.privateKey,
            address: wallet.address,
        })
    }

    
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


