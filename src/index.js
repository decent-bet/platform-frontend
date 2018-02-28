import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import App from './Components/Dapp'

import Web3Loader from './Components/Base/Web3Loader'

import './index.css'
import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

const web3Loader = new Web3Loader()
web3Loader.init()

let landingApp = React.createElement(App)
ReactDOM.render(landingApp,document.getElementById('root'))
