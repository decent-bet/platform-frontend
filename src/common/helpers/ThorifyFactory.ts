import { THOR_NODE_URL } from '../../config'
import { thorify } from 'thorify'
import Web3 from 'web3'
import { IKeyHandler, IThorifyFactory } from '../types'

export default class ThorifyFactory implements IThorifyFactory {
    private _thorify: any = null

    constructor(thor: any, private _keyHandler?: IKeyHandler) {
        this._thorify = thor
    }

    public async make(
        publicAddress?: string,
        privateKey?: string
    ): Promise<any> {
        if (!this._thorify) {
            this._thorify = thorify(new Web3(), THOR_NODE_URL)
        }

        if (this._keyHandler) {
            if (!publicAddress) {
                const address = await this._keyHandler.getPublicAddress()
                if (address) {
                    publicAddress = address as string
                }
            }

            if (!privateKey) {
                const wallet = await this._keyHandler.getWalletValues()
                if (wallet && wallet.privateKey) {
                    privateKey = wallet.privateKey
                    this._thorify.eth.accounts.wallet.add(privateKey)
                }
            } else {
                this._thorify.eth.accounts.wallet.add(privateKey)
            }

            this._thorify.eth.defaultAccount = publicAddress
        }
        return this._thorify
    }
}
