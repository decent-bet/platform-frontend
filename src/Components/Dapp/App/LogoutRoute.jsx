import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Thunks } from '../../../Model/auth'
import { VIEW_LOGIN } from '../../Constants'

class LogoutRoute extends Component {
    
    renderRedirect = () => {
        this.props.dispatch(Thunks.logout())
        return <Redirect
        to={{
            pathname: VIEW_LOGIN,
            state: { from: this.props.location }
        }}
    />
    }
    render() {
        let { ...rest } = this.props
        return <Route {...rest} component={this.renderRedirect} />
    }
}

// Connect this component to Redux
export default connect(state => state.auth)(LogoutRoute)