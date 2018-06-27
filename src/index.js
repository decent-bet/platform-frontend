import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './Components/Dapp'
import { Web3Loader } from './Web3'

import './index.css'
import './css/bootstrap.min.css'
import './css/main.css'

// Load Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { faEthereum } from '@fortawesome/fontawesome-free-brands'
library.add(faSolid, faEthereum)

// Inject tap event plugin
injectTapEventPlugin()

// Init Web3
new Web3Loader()

let landingApp = React.createElement(App)
ReactDOM.render(landingApp, document.getElementById('root'))
