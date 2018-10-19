import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PublicRouteContainer from '../common/components/PublicRouteContainer'
import AuthRouter from './AuthRouter'
import actions from './state/actions'

class Auth extends React.Component<IAuthProps> {
    constructor(props: IAuthProps) {
        super(props)
    }

    public render() {
        return (
            <PublicRouteContainer>
                <AuthRouter />
            </PublicRouteContainer>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth)
