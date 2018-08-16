import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { KeyHandler } from '../../../Web3'
import { VIEW_LOGIN } from '../../Constants'

const keyHandler = new KeyHandler()

export default class PrivateRoute extends React.Component {
    renderCaptiveComponent = props => {
        if (keyHandler.isLoggedIn()) {
            let { component: Component } = this.props
            return <Component {...props} />
        } else {
            return (
                <Redirect
                    to={{
                        pathname: VIEW_LOGIN,
                        state: { from: props.location }
                    }}
                />
            )
        }
    }

    render() {
        let { ...rest } = this.props
        return <Route {...rest} render={this.renderCaptiveComponent} />
    }
}
