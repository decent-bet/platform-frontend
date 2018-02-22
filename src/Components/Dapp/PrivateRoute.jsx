import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import KeyHandler from '../Base/KeyHandler'

const keyHandler = new KeyHandler()
const constants = require('../Constants')

export default class PrivateRoute extends React.Component {
    renderCaptiveComponent = props => {
        if (keyHandler.isLoggedIn()) {
            let { component: Component } = this.props
            return <Component {...props} />
        } else {
            return (
                <Redirect
                    to={{
                        pathname: constants.VIEW_LOGIN,
                        state: { from: props.location }
                    }}
                />
            )
        }
    }

    render() {
        let { component: _Component, ...rest } = this.props
        return <Route {...rest} render={this.renderCaptiveComponent} />
    }
}
