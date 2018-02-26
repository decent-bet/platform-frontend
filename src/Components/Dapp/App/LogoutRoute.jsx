import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import KeyHandler from '../../Base/KeyHandler'

const keyHandler = new KeyHandler()

export default class LogoutRoute extends Component {
    renderRedirect = routeProps => {
        keyHandler.clear()
        let { component: Component } = this.props
        return <Component {...routeProps} />
    }
    render() {
        let { component: _Component, ...rest } = this.props
        return <Route {...rest} render={this.renderRedirect} />
    }
}
