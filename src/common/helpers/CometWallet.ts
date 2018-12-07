import { IExternalWallet } from '../types/IExternalWallet'
export class CometWallet implements IExternalWallet {
    constructor(private comet: any) {}

    /**
     * Requests wallet account access
     */
    public async enable(): Promise<string> {
        try {
            const [cometAccount] = await this.comet.enable()
            return cometAccount
        } catch (e) {
            console.log(`User rejected request ${e}`)
            return ''
        }
    }
}
