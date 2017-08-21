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

metaMaskLoader.setOnLoadMetaMaskListener(() => {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={Dapp}/>
            <Route path="/dapp" component={Dapp}/>
            <Route path="*" component={() => {
                window.location = "/"
            }}/>
        </Router>,
        document.getElementById('root')
    )
})
