/**
 * Created by user on 4/20/2017.
 */

import React from 'react'

const ethUnits = require('ethereum-units')
const ethJsUtil = require('ethereumjs-util')

let contractHelper

class Helper {

    getWeb3 = () => {
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

    capitalize = (string) => {
        return string.substr(0, 1).toUpperCase() + string.substring(1, string.length + 1)
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

    convertToEther = (number) => {
        return number * ethUnits.units.ether
    }

    getEtherInWei = () => {
        return ethUnits.units.ether
    }

    formatEther = (ether) => {
        return ether / this.getEtherInWei()
    }

    roundDecimals = (number, decimals) => {
        let multiplier = 10 ^ decimals
        return Math.round(number * multiplier) / multiplier
    }

    isLoggedIn = () => {
        return localStorage.getItem('loggedIn') != null
    }

    mockLogin = () => {
        localStorage.setItem('loggedIn', true)
    }

    mockLogout = () => {
        localStorage.removeItem('loggedIn')
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

}

export default Helper