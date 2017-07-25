/**
 * Created by user on 5/20/2017.
 */

/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import Web3 from 'web3'

import ContractHelper from '../ContractHelper'

const contractHelper = new ContractHelper()

let callback

const IS_TEST = false

let initMetaMask = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log('Mist/Metamask web3 detected')
        window.web3 = new Web3(web3.currentProvider);
        window.web3.eth.defaultAccount = window.web3.eth.accounts[0]
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

        // Show no mist/metamask extension error
        window.web3 = contractHelper.getWeb3();
        window.web3.eth.defaultAccount = window.web3.eth.accounts[1]
    }
    if (!IS_TEST)
        contractHelper.getAllContracts((err, token, house, sportsBetting) => {
            console.log('getAllContracts: ' + err + ', ' + token.address + ', ' + house.address + ', ' +
                sportsBetting.address + ', ' + window.web3.eth.defaultAccount)
            window.contractHelper = contractHelper
            if (callback)
                callback()
        })
    else if (callback)
        callback()
}

window.addEventListener('load', function () {
    initMetaMask()
})

class MetaMaskLoader {

    setOnLoadMetaMaskListener = (_callback) => {
        callback = _callback
    }

}

export default MetaMaskLoader