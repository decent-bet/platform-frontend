import ethUtil from "ethereumjs-util";

/**
 * Utils class for common use
 */

export class Utils {

    /**
     * Verify a sign for the message sign and given address
     *
     * @param {string} msg
     * @param {string} sign
     * @param {string} address
     */
    static verifySign(msg, sign, address) {
        let sigParams = ethUtil.fromRpcSig(sign)
        let msgHash = ethUtil.sha3(msg)

        let r = sigParams.r
        let s = sigParams.s
        let v = ethUtil.bufferToInt(sigParams.v)

        let publicKeyBuffer = ethUtil.ecrecover(msgHash, v, r, s)
        let publicKey = ethUtil.bufferToHex(publicKeyBuffer)
        publicKey = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKey))

        console.log(
            'Verify sign - Public key',
            publicKey,
            address
        )

        return publicKey === address.toLowerCase()
    }
}
