import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import axios from 'axios'
import { AUTH_API_URL } from './config'
axios.defaults.baseURL = AUTH_API_URL

import { thorify } from 'thorify'
import { extend } from 'thorify/dist/extend'
const Web3 = require('web3') // Recommend using require() instead of import here

window.addEventListener('load', function() {
    let cometWallet = (window as any).thor
    let thorProvider = null
    if (typeof cometWallet !== 'undefined') {
        // Use thor provider
        thorProvider = new Web3(cometWallet)
        // Extend web3 to connect to VeChain Blockchain
        extend(thorProvider)
    }

    ReactDOM.render(
        <Provider store={store(cometWallet, thorProvider)}>
            <App />
        </Provider>,
        document.getElementById('root') as HTMLElement
    )
})
