/**
 * Created by user on 4/20/2017.
 */

import React from 'react'

const ethUnits = require('ethereum-units')
const ethJsUtil = require('ethereumjs-util')

const BigNumber = require('bignumber.js')

const IS_DEV = true

class Helper {

    isDev = () => {
        return IS_DEV
    }

    getWeb3 = () => {
        if (!window.web3Object.eth.defaultAccount)
            window.web3Object.eth.defaultAccount = window.web3Object.eth.accounts[0]
        return window.web3Object
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    getTimestamp = () => {
        return Math.round(new Date().getTime() / 1000)
    }

    Htmlify(html) {
        return <div dangerouslySetInnerHTML={{__html: html}}></div>;
    }

    getEtherInWei = () => {
        return ethUnits.units.ether
    }

    convertToEther = (number) => {
        return new BigNumber(number).times(this.getEtherInWei()).toFixed(0)
    }

    formatEther = (ether) => {
        return new BigNumber(ether).dividedBy(this.getEtherInWei()).toFixed(0)
    }

    roundDecimals = (number, decimals) => {
        let multiplier = 10 ^ decimals
        return Math.round(number * multiplier) / multiplier
    }

    capitalize = (string) => {
        return string.substr(0, 1).toUpperCase() + string.substring(1, string.length + 1)
    }

    isUndefined = (object) => {
        return typeof object == 'undefined'
    }

    duplicate = (obj) => {
        return JSON.parse(JSON.stringify(obj))
    }

}

export default Helper