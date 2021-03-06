import ethUtil from 'ethereumjs-util'
import BaseContract from './BaseContract'

export default class SlotsChannelFinalizerContract extends BaseContract<any> {
    public async finalize(id, userSpin, houseSpin) {
        userSpin = await this.getSpinParts(userSpin)
        houseSpin = await this.getSpinParts(houseSpin)
        const data = this.instance.methods
            .finalize(
                id,
                userSpin.parts,
                houseSpin.parts,
                userSpin.r,
                userSpin.s,
                houseSpin.r,
                houseSpin.s
            )
            .encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            1000000,
            data
        )
    }

    public async finalizeZeroNonce(id, userSpin) {
        userSpin = await this.getSpinParts(userSpin)

        let logKeys = spin => {
            Object.keys(spin).forEach(key => {
                console.log('Finalize', key, spin[key], typeof spin[key])
            })
        }

        logKeys(userSpin)

        const emptyBytes32 =
            '0x0000000000000000000000000000000000000000000000000000000000000000'

        const data = this.instance.methods
            .finalize(
                id,
                userSpin.parts,
                '',
                userSpin.r,
                userSpin.s,
                emptyBytes32,
                emptyBytes32
            )
            .encodeABI()

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            data
        )
    }

    public async getSpinParts(spin) {
        let sign = spin.sign

        let sigParams = ethUtil.fromRpcSig(sign)

        let r = ethUtil.bufferToHex(sigParams.r)
        let s = ethUtil.bufferToHex(sigParams.s)
        let v = ethUtil.bufferToInt(sigParams.v)

        console.log('getSpinParts sig: ', sign, v, r, s)

        console.log('getSpinParts reverse sig: ', ethUtil.toRpcSig(v, r, s))

        return {
            parts:
                spin.reelHash +
                '/' +
                (spin.reel !== '' ? spin.reel.toString() : '') +
                '/' +
                spin.reelSeedHash +
                '/' +
                spin.prevReelSeedHash +
                '/' +
                spin.userHash +
                '/' +
                spin.prevUserHash +
                '/' +
                spin.nonce +
                '/' +
                spin.turn +
                '/' +
                spin.userBalance +
                '/' +
                spin.houseBalance +
                '/' +
                spin.betSize +
                '/' +
                v,
            r,
            s
        }
    }
}
