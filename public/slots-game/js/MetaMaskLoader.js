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
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log('Mist/Metamask web3 detected')
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

        //TODO: Show no mist/metamask extension error
    }
    if (callback) {
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

