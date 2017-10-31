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

let loadContracts = () => {
    const contractHelper = new ContractHelper()

    contractHelper.getAllContracts((err, token, house, bettingProvider) => {
        console.log('getAllContracts: ' + err + ', ' + token.address + ', ' + house.address + ', ' +
            bettingProvider.address + ', ' + window.web3.eth.defaultAccount)
        window.contractHelper = contractHelper
        if (callback)
            callback()
    })
}

let initMetaMask = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log('Mist/Metamask web3 detected ', web3.currentProvider, window.web3.eth.accounts)
        window.web3 = new Web3(web3.currentProvider)
        window.web3.eth.defaultAccount = window.web3.eth.accounts[0]
        if (window.web3.eth.accounts.length == 0)
            window.web3.eth.getAccounts(function (err, accounts) {
                if (!err) {
                    window.web3.eth.defaultAccount = accounts[0]
                }
                loadContracts()
            })
        else
            loadContracts()
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

        const provider = new Web3.providers.HttpProvider('http://localhost:8545')
        const web3 = new Web3(provider)

        // Show no mist/metamask extension error
        window.web3 = web3
        window.web3.eth.defaultAccount = window.web3.eth.accounts[0]
        loadContracts()
    }

    console.log('Default account', window.web3.eth.defaultAccount)
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