import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import App from './Components/v2/Dapp/App'
import Dashboard from './Components/v2/Dapp/Dashboard/Dashboard'
import Login from './Components/v2/Dapp/Login/Login'

import KeyHandler from './Components/v2/Base/KeyHandler'
import Web3Loader from './Components/v2/Base/Web3Loader'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

const keyHandler = new KeyHandler()
const web3Loader = new Web3Loader()

const constants = require('./Components/v2/Constants')

let replaceUrl = (url) => {
    if (window.history.replaceState)
        window.history.replaceState('', document.title, url)
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={() => {
                if (keyHandler.isLoggedIn()) {
                    web3Loader.init()
                    return <Dashboard
                        view={constants.VIEW_DEFAULT}
                    />
                } else {
                    replaceUrl(constants.VIEW_LOGIN)
                    return <Login/>
                }
            }}/>
            <Route path={constants.VIEW_PORTAL} component={() => {
                return <Dashboard
                    view={constants.VIEW_PORTAL}
                />
            }}/>
            <Route path={constants.VIEW_CASINO} component={() => {
                return <Dashboard
                    view={constants.VIEW_CASINO}
                />
            }}/>
            <Route path={constants.VIEW_PORTAL} component={() => {
                return <Dashboard
                    view={constants.VIEW_PORTAL}
                />
            }}/>
            <Route path={constants.VIEW_SLOTS} component={() => {
                return <Dashboard
                    view={constants.VIEW_SLOTS}
                />
            }}/>
            <Route path={constants.VIEW_SLOTS_GAME} component={() => {
                return <Dashboard
                    view={constants.VIEW_SLOTS_GAME}
                />
            }}/>
            <Route path="/logout" component={() => {
                keyHandler.clear()
                replaceUrl(constants.VIEW_LOGIN)
                return <Login/>
            }}/>
            <Route path="*" component={() => {
                window.location = "/"
            }}/>
        </Route>
    </Router>,
    document.getElementById('root')
)
