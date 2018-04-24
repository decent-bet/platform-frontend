import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './Components/Dapp'
import Web3Loader from './Components/Base/Web3Loader'

import './index.css'
import './css/bootstrap.min.css'
import './css/main.css'

// Load Fontawesome
import fontawesome from '@fortawesome/fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { faEthereum } from '@fortawesome/fontawesome-free-brands'
fontawesome.library.add(faSolid, faEthereum)

// Inject tap event plugin
injectTapEventPlugin()

const web3Loader = new Web3Loader()
web3Loader.init()

let landingApp = React.createElement(App)
ReactDOM.render(landingApp, document.getElementById('root'))
