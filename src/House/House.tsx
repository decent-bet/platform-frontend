import React, { Component } from 'react'
import { Grid, Paper, CircularProgress } from '@material-ui/core'
import HouseBalanceCard from './HouseBalanceCard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as thunks from './state/thunks'
import { IHouseProps } from './IHouseProps'
import { IHouseState, StateMachine, DefaultHouseState } from './IHouseState'

/**
 * House Page Landing Component
 */
class House extends Component<IHouseProps, IHouseState> {
    public state = DefaultHouseState

    public async componentDidMount() {
        await this.props.getHouseBalance()
        this.setState({ stateMachine: StateMachine.Ready })
    }

    public renderLoadingScreen = () => <CircularProgress />

    public renderReadyContent = () => (
        <HouseBalanceCard balance={this.props.houseBalance} />
    )

    public renderStateMachine = (): JSX.Element | null => {
        switch (this.state.stateMachine) {
            case StateMachine.Loading:
                return this.renderLoadingScreen()
            case StateMachine.Ready:
                return this.renderReadyContent()
            default:
                return null
        }
    }

    public render() {
        return (
            <Grid container={true} justify="center" direction="row">
                <Grid item={true} xs={12} md={8} lg={6}>
                    <Paper>{this.renderStateMachine()}</Paper>
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
