
import Actions, { Prefix } from './actionTypes'
import { createActions } from 'redux-actions'
import { Wallet } from 'ethers'

async function login(data, chainProvider, keyHandler) {
    let wallet
    let values

    if (data.includes(' ')) {
        // Passphrase Mnemonic mode
        wallet = Wallet.fromMnemonic(data, "m/44'/818'/0'/0")
        values = {
            mnemonic: data,
            privateKey: wallet.privateKey,
            address: wallet.address
        }
    } else {
        // Private Key Mode
        // Adds '0x' to the beginning of the key if it is not there.
        if (data.substring(0, 2) !== '0x') {
            data = '0x' + data
        }

        wallet = new Wallet(data)
        values = {
            privateKey: wallet.privateKey,
            address: wallet.address
        }
    }

    await keyHandler.initialize()
    await keyHandler.set(values)
    await chainProvider.setupThorify(values.address, values.privateKey)
}

async function logout(keyHandler) {
    await keyHandler.clear()
    return true
}

async function getProviderUrl(chainProvider) {
    return chainProvider.providerUrl
}

async function setProviderUrl(chainProvider, url) {
    await chainProvider.setProviderUrl(url)
}

export default createActions({
    [Prefix]: {
        [Actions.LOGIN]: login,
        [Actions.LOGOUT]: logout,
        [Actions.GET_PROVIDER_URL]: getProviderUrl,
        [Actions.SET_PROVIDER_URL]: setProviderUrl
    }
})


