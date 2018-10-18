import { getStageConfig } from '../../config'
import { thorify } from 'thorify'
import Web3 from 'web3'
import { IKeyHandler, IThorifyFactory } from '../types'

export default class ThorifyFactory implements IThorifyFactory {
    private _thorify: any = null
    private _config: any

    constructor(private _keyHandler: IKeyHandler) {
        this._config = getStageConfig()
    }

    public make(): any {
        if (!this._thorify) {
            this._thorify = thorify(new Web3(), this._config.thorNode)
        }
        return this._thorify
    }

    public async configured(
        publicAddress?: string,
        privateKey?: string
    ): Promise<any> {
        this.make()

        if (!publicAddress) {
            const address = await this._keyHandler.getPublicAddress()
            if (address) {
                publicAddress = address as string
            }
        }

        if (!privateKey) {
            const wallet = await this._keyHandler.getWalletValues()
            privateKey = wallet.privateKey
        }

        this._thorify.eth.accounts.wallet.add(privateKey)
        this._thorify.eth.defaultAccount = publicAddress
        return this._thorify
    }
}
