import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import { KeyHandler } from '../../../Web3'

const keyHandler = new KeyHandler()

export default class LogoutRoute extends Component {
    renderRedirect = routeProps => {
        keyHandler.clear()
        let { component: Component } = this.props
        return <Component {...routeProps} />
    }
    render() {
        let { ...rest } = this.props
        return <Route {...rest} render={this.renderRedirect} />
    }
}
