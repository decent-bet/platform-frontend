import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import MetaMaskLoader from './Components/v2/Base/MetaMaskLoader'
import Dapp from './Components/v2/Dapp/Dapp'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

const metaMaskLoader = new MetaMaskLoader()
const constants = require('./Components/v2/Constants')

metaMaskLoader.setOnLoadMetaMaskListener(() => {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" view={constants.DAPP_VIEW_CASINO} component={Dapp}/>
            <Route path="/dapp" view={constants.DAPP_VIEW_CASINO} component={Dapp}/>
            <Route path="/slots" view={constants.DAPP_VIEW_SLOTS} component={Dapp}/>
            <Route path="/slots/game" view={constants.DAPP_VIEW_SLOTS_GAME} component={Dapp}/>
            <Route path="*" component={() => {
                window.location = "/"
            }}/>
        </Router>,
        document.getElementById('root')
    )
})
