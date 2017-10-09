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
        if (!window.web3.eth.defaultAccount)
            window.web3.eth.defaultAccount = window.web3.eth.accounts[0]
        return window.web3
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    getTimestamp = () => {
        return Math.round(new Date().getTime() / 1000)
    }

    getTimestampMillis = () => {
        return new Date().getTime()
    }

    formatHeading = (string) => {
        let formattedString = ''
        for (let i = 0; i < string.length; i++) {
            if (string[i] == '_')
                formattedString += '&ensp;';
            else
                formattedString += string[i].toUpperCase() + ' '
        }
        return this.Htmlify(formattedString)
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

    fixLargeNumber = (num) => {
        let str = '';
        do {
            let a = num % 10;
            num = Math.trunc(num / 10);
            str = a + str;
        } while (num > 0)
        return str;
    }

    intToHex = (number) => {
        return ethJsUtil.bufferToHex(ethJsUtil.setLengthLeft(number, 32))
    }

    duplicate = (obj) => {
        return JSON.parse(JSON.stringify(obj))
    }

}

export default Helper