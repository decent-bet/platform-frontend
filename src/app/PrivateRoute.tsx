import * as React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { VIEW_LOGIN } from '../shared/routes'
import { userIsLoggedIn } from './thunks'
import { connect } from 'react-redux'

interface IPrivateRouteProps extends RouteProps {
    dispatch?: (action) => void,
    isLoggedIn: boolean
}

class PrivateRoute extends React.Component<IPrivateRouteProps> {
    
    constructor(props: IPrivateRouteProps) {
        super(props)
    }

    public async componentDidMount () {
        if(this.props.dispatch) {
            await this.props.dispatch(userIsLoggedIn())
        }
    }

    private renderCaptiveComponent = (props) => {
        let { isLoggedIn } = this.props

        if (isLoggedIn === true) {

            let { component } = this.props
            return <React.Component component={component} {...props} />

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

export default connect((state: any) => state.app)(PrivateRoute)