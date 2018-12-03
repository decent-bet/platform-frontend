import React, { Component } from 'react'
import { Grid, Paper } from '@material-ui/core'
import HouseBalanceCard from './HouseBalanceCard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as thunks from './state/thunks'
import { IState } from './state/IState'

interface IHouseProps extends IState {
    [id: string]: any
}

class House extends Component<IHouseProps, {}> {
    public componentDidMount() {
        this.props.getHouseBalance()
    }
    public render() {
        return (
            <Grid container={true} justify="center" direction="row">
                <Grid item={true} xs={12} md={8} lg={6}>
                    <Paper>
                        <HouseBalanceCard balance={this.props.houseBalance} />
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return { ...state.house }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...thunks }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(House)
