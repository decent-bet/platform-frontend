import ethUtil from 'ethereumjs-util'
import ethAbi from 'web3-eth-abi'
import BaseContract from './BaseContract'

export default class SlotsChannelFinalizerContract extends BaseContract {

    async finalize(id, userSpin, houseSpin) {
        userSpin = await this.getSpinParts(userSpin)
        houseSpin = await this.getSpinParts(houseSpin)

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'finalize',
            type: 'function',
            inputs: [{
                    name: 'id',
                    type: 'bytes32'
                },
                {
                    name: '_curr',
                    type: 'string'
                },
                {
                    name: '_prior',
                    type: 'string'
                },
                {
                    name: 'currR',
                    type: 'bytes32'
                },
                {
                    name: 'currS',
                    type: 'bytes32'
                },
                {
                    name: 'priorR',
                    type: 'bytes32'
                },
                {
                    name: 'priorS',
                    type: 'bytes32'
                }
            ]
        }, [
            id,
            userSpin.parts,
            houseSpin.parts,
            userSpin.r,
            userSpin.s,
            houseSpin.r,
            houseSpin.s
        ])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async finalizeZeroNonce(id, userSpin) {
        userSpin = this.getSpinParts(userSpin)

        console.log(
            'Finalize',
            id,
            typeof id,
            this.web3.eth.defaultAccount
        )

        let logKeys = spin => {
            Object.keys(spin).forEach(key => {
                console.log(
                    'Finalize',
                    key,
                    spin[key],
                    typeof spin[key]
                )
            })
        }

        logKeys(userSpin)

        console.log(
            'Finalize string: "' +
            id +
            '", "' +
            userSpin.parts +
            '", "' +
            '", "' +
            userSpin.r +
            '", "' +
            userSpin.s
        )

        const emptyBytes32 =
            '0x0000000000000000000000000000000000000000000000000000000000000000'

        let encodedFunctionCall = ethAbi.encodeFunctionCall({
            name: 'finalize',
            type: 'function',
            inputs: [{
                name: 'id',
                type: 'bytes32'
            },
                {
                    name: '_curr',
                    type: 'string'
                },
                {
                    name: '_prior',
                    type: 'string'
                },
                {
                    name: 'currR',
                    type: 'bytes32'
                },
                {
                    name: 'currS',
                    type: 'bytes32'
                },
                {
                    name: 'priorR',
                    type: 'bytes32'
                },
                {
                    name: 'priorS',
                    type: 'bytes32'
                }
            ]
        }, [
            id,
            userSpin.parts,
            '',
            userSpin.r,
            userSpin.s,
            emptyBytes32,
            emptyBytes32
        ])

        return await this.signAndSendRawTransaction(
            this.instance.options.address,
            null,
            null,
            encodedFunctionCall
        )
    }

    async getSpinParts(spin) {
        let sign = spin.sign

        let sigParams = ethUtil.fromRpcSig(sign)

        let r = ethUtil.bufferToHex(sigParams.r)
        let s = ethUtil.bufferToHex(sigParams.s)
        let v = ethUtil.bufferToInt(sigParams.v)

        console.log('getSpinParts sig: ', sign, v, r, s)

        console.log('getSpinParts reverse sig: ', ethUtil.toRpcSig(v, r, s))

        return {
            parts: spin.reelHash +
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
            r: r,
            s: s
        }
    }

}
