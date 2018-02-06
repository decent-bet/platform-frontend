import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import App from './Components/Dapp/App'
import Dashboard from './Components/Dapp/Dashboard/Dashboard'
import Login from './Components/Dapp/Login/Login'

import KeyHandler from './Components/Base/KeyHandler'
import Web3Loader from './Components/Base/Web3Loader'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

const keyHandler = new KeyHandler()
const web3Loader = new Web3Loader()

const constants = require('./Components/Constants')

let replaceUrl = (url) => {
    if (window.history.replaceState)
        window.history.replaceState('', document.title, url)
}

function requireAuth(nextState, replace) {
  if (!keyHandler.isLoggedIn()) {
    browserHistory.push(constants.VIEW_LOGIN)
  }
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_DEFAULT} />
            }}/>
            <Route path={constants.VIEW_CASINO} onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_CASINO} />
            }}/>
            <Route path={constants.VIEW_BALANCES} onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_BALANCES} />
            }}/>
            <Route path={constants.VIEW_HOUSE} onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_HOUSE} />
            }}/>
            <Route path={constants.VIEW_SLOTS} onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_SLOTS} />
            }}/>
            <Route path={constants.VIEW_SLOTS_GAME} onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_SLOTS_GAME} />
            }}/>
            <Route path={constants.VIEW_PORTAL} onEnter={requireAuth} component={() => {
                return <Dashboard view={constants.VIEW_PORTAL} />
            }}/>
            <Route path={constants.VIEW_LOGIN} component={() => {
                return <Login/>
            }}/>
        </Route>
    </Router>,
    document.getElementById('root')
)
