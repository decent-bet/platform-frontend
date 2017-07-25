/**
 * Created by user on 7/4/2017.
 */

/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

var callback

var initMetaMask = function () {
    if (callback) {
        window.web3 = parent.window.web3;
        window.contractHelper = parent.window.contractHelper
        console.log('Initialized contract helper: ' + window.contractHelper.getTokenInstance().address)
        window.web3.eth.defaultAccount = window.web3.eth.accounts[0]
        callback()
    }
}

window.addEventListener('load', function () {
    initMetaMask()
})

var setOnLoadMetaMaskListener = function (_callback) {
    callback = _callback
}

