/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

var callback

var initWeb3 = function () {
    if (callback) {
        window.web3 = parent.window.web3Object;
        window.contractHelper = parent.window.contractHelper
        callback()
    }
}

window.addEventListener('load', function () {
    initWeb3()
})

var setOnLoadWeb3Listener = function (_callback) {
    callback = _callback
}

