import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { VIEW_LOGIN } from '../../Constants'
import { Thunks as BalanceThunks } from '../../../Model/balance'
import { connect } from 'react-redux'
import { Thunks } from '../../../Model/auth'

class PrivateRoute extends React.Component {

    renderCaptiveComponent = (props) => {
        let isLoggedIn = this.props.dispatch(Thunks.userIsLoggedIn())

        if (isLoggedIn === true) {
            this.props.dispatch(Thunks.setupChainProvider())
            this.props.dispatch(BalanceThunks.listenForTransfers())

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
        return <Route {...rest} component={this.renderCaptiveComponent} />
    }
}

// Connect this component to Redux
export default connect(state => state.auth)(PrivateRoute)