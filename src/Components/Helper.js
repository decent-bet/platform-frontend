import React from 'react'
import EventBus from 'eventing-bus'
import ethUnits from 'ethereum-units'
import BigNumber from 'bignumber.js'
import * as constants from './Constants'

export default class Helper {
    isDev = () => {
        return process.env['NODE_ENV'] !== 'production'
    }

    getWeb3 = () => {
        return window.web3Object
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    getGethProvider = () => {
        let provider = localStorage.getItem(constants.KEY_GETH_PROVIDER)
        let defaultProvider = this.isDev()
            ? constants.PROVIDER_LOCAL
            : constants.PROVIDER_DBET
        return provider == null ? defaultProvider : provider
    }

    setGethProvider = provider => {
        localStorage.setItem(constants.KEY_GETH_PROVIDER, provider)
    }

    getTimestamp = () => {
        return this.getTimestampInMillis() / 1000
    }

    getTimestampInMillis = () => {
        return Math.round(new Date().getTime())
    }

    Htmlify(html) {
        return <div dangerouslySetInnerHTML={{ __html: html }} />
    }

    getEtherInWei = () => {
        return ethUnits.units.ether
    }

    convertToEther = number => {
        return new BigNumber(number).times(this.getEtherInWei()).toFixed(0)
    }

    formatEther = ether => {
        return new BigNumber(ether).dividedBy(this.getEtherInWei()).toFixed(2)
    }

    roundDecimals = (number, decimals) => {
        let multiplier = 10 ^ decimals
        return Math.round(number * multiplier) / multiplier
    }

    capitalize = string => {
        return (
            string.substr(0, 1).toUpperCase() +
            string.substring(1, string.length + 1)
        )
    }

    isUndefined = object => {
        return typeof object == 'undefined'
    }

    duplicate = obj => {
        return JSON.parse(JSON.stringify(obj))
    }

    commafy = number => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    toggleSnackbar = message => {
        EventBus.publish('showSnackbar', message)
    }
}
