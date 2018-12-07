import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from '../common/state/thunks'
import Routes from '../routes'
import AppLoadding from '../common/components/AppLoading'

function Logout(props) {
    props.logout().then(() => {
        if (window.location.href !== Routes.Login) {
            window.location.href = Routes.Login
        }
    })

    return <AppLoadding />
}

const mapStateToProps = state => Object.assign({}, state.app)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const LogoutContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Logout)
export default LogoutContainer
