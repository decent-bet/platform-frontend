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

let redirectToLogin = () => {
    replaceUrl(constants.VIEW_LOGIN)
    return <Login/>
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
                } else
                    return redirectToLogin()
            }}/>
            <Route path={constants.VIEW_CASINO} component={() => {
                if (keyHandler.isLoggedIn())
                    return <Dashboard
                        view={constants.VIEW_CASINO}
                    />
                else
                    return redirectToLogin()
            }}/>
            <Route path={constants.VIEW_SLOTS} component={() => {
                if (keyHandler.isLoggedIn())
                    return <Dashboard
                        view={constants.VIEW_SLOTS}
                    />
                else
                    return redirectToLogin()
            }}/>
            <Route path={constants.VIEW_SLOTS_GAME} component={() => {
                if (keyHandler.isLoggedIn())
                    return <Dashboard
                        view={constants.VIEW_SLOTS_GAME}
                    />
                else
                    return redirectToLogin()
            }}/>
            <Route path="/logout" component={() => {
                keyHandler.clear()
                redirectToLogin()
            }}/>
            <Route path="*" component={() => {
                window.location = "/"
            }}/>
        </Route>
    </Router>,
    document.getElementById('root')
)
