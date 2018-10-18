import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import { Grid, Typography } from '@material-ui/core'

class AccountNotActivated extends React.Component<any> {
    constructor(props) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <Grid container={true} direction="column" spacing={40}>
                <Grid item={true} xs={12}>
                    <Typography>Account not activated</Typography>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.account, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const AccountNotActivatedContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountNotActivated)
export default AccountNotActivatedContainer
