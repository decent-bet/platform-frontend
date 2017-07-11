import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'

import MetaMaskLoader from './Components/Base/MetaMaskLoader'
import Home from './Components/Home/v2/Home'
import AdminPanel from './Components/Admin/AdminPanel'
import Crowdsale from './Components/Crowdsale/Crowdsale'
import Dapp from './Components/Dapp/Dapp'
import Faq from './Components/Faq/Faq'
import Roadmap from './Components/Roadmap/Roadmap'
import Slots from './Components/Slots/Slots'

const metaMaskLoader = new MetaMaskLoader()

metaMaskLoader.setOnLoadMetaMaskListener(() => {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={Home}/>
            <Route path="/admin" component={AdminPanel}/>
            <Route path="/ico" component={Crowdsale}/>
            <Route path="/dapp" component={Dapp}/>
            <Route path="/faq" component={Faq}/>
            <Route path="/roadmap" component={Roadmap}/>
            <Route path="/slots" component={Slots}/>
        </Router>,
        document.getElementById('root')
    )
})
