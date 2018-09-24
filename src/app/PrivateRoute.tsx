import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { VIEW_LOGIN } from '../shared/routes'
import { userIsLoggedIn } from './thunks'

export default class PrivateRoute extends React.Component<any> {
    
    constructor(props: any) {
        super(props)
    }

    public async componentDidMount () {
        await this.props.dispatch(userIsLoggedIn())
    }

    private renderCaptiveComponent = (props) => {
        let { isLoggedIn } = this.props

        if (isLoggedIn === true) {

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

    public render() {
        let { ...rest } = this.props
        return <Route {...rest} component={this.renderCaptiveComponent} />
    }
}