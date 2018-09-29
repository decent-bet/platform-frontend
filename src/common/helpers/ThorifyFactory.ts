import { getStageConfig } from '../../config'
import { thorify } from "thorify"
import Web3 from "web3"

export default class ThorifyFactory {
    private _thorify: any

    constructor(private keyHandler) {}

    public async make() {
        let stage = this.keyHandler.getStage()
        let config = getStageConfig(stage)
        
        if(!this._thorify) {
            thorify(new Web3(), config.thorNode)
        } else {
            this._thorify.setProvider(config.thorNode)
        }

        let { privateKey } = await this.keyHandler.get()
        this._thorify.eth.accounts.wallet.add(privateKey)
        this._thorify.eth.defaultAccount = this.keyHandler.getAddress()   
        return this._thorify
    }
}
