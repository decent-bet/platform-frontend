import * as React from 'react'
import { bindActionCreators } from 'redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import * as thunks from '../common/state/thunks'
import { VIEW_LOGIN } from '../routes'

function Logout(props) {
    props.logout().then(() => {
        window.location.href = VIEW_LOGIN
    })

    return (
        <Grid
            container={true}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ height: '100vh' }}
        >
            <Grid item={true} xs={12}>
                <CircularProgress />
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => Object.assign({}, state.app)
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign(
        {},
        thunks
    ), dispatch)


const LogoutContainer = connect(mapStateToProps, mapDispatchToProps)(Logout)
export default LogoutContainer

