import { getStageConfig } from '../../config'
import { thorify } from "thorify"
import Web3 from "web3"
import IKeyHandler from './IKeyHandler'

export default class ThorifyFactory {
    private _thorify: any

    constructor(private keyHandler: IKeyHandler) {}

    public async make() {
        let stage = this.keyHandler.getStage()
        let config = getStageConfig(stage)
        
        if(!this._thorify) {
            this._thorify = thorify(new Web3(), config.thorNode)
        } else {
            this._thorify.setProvider(config.thorNode)
        }

        let { privateKey } = await this.keyHandler.getWalletValues()
        this._thorify.eth.accounts.wallet.add(privateKey)
        this._thorify.eth.defaultAccount = this.keyHandler.getPublicAddress()   
        return this._thorify
    }
}
