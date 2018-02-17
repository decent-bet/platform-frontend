import React from 'react'

import EventBus from 'eventing-bus'

const ethUnits = require('ethereum-units')
const BigNumber = require('bignumber.js')
const constants = require('./Constants')

const IS_DEV = false

const SELECTED_TESTNET = constants.TESTNET_SLOTS

class Helper {

    isDev = () => {
        return IS_DEV
    }

    getWeb3 = () => {
        return window.web3Object
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    getGethProvider = () => {
        let provider = localStorage.getItem(constants.KEY_GETH_PROVIDER)
        return provider == null ? constants.PROVIDER_DBET : provider
    }

    setGethProvider = (provider) => {
        localStorage.setItem(constants.KEY_GETH_PROVIDER, provider)
    }

    getSelectedTestNet = () => {
        return SELECTED_TESTNET
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
        return new BigNumber(ether).dividedBy(this.getEtherInWei()).toFixed(2)
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

    commafy = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    toggleSnackbar = (message) => {
        EventBus.publish('showSnackbar', message)
    }

}

export default Helper