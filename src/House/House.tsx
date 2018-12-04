import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import HouseBalanceCard from './HouseBalanceCard'
import HouseDepositList from './HouseDepositList'
import Loading from './Loading'
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
        // Execute all requests in parallel
        await Promise.all([
            this.props.getHouseBalance(),
            this.props.getHouseDeposits()
        ])
        this.setState({ stateMachine: StateMachine.Ready })
    }

    public renderLoadingScreen = () => <Loading />

    public renderReadyContent = () => (
        <>
            <Grid item={true} xs={12} md={6} lg={4}>
                <HouseBalanceCard balance={this.props.houseBalance} />
            </Grid>

            <Grid item={true} xs={12} md={6} lg={8}>
                <HouseDepositList
                    houseDepositList={this.props.houseDepositList}
                />
            </Grid>
        </>
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
            <Grid container={true} spacing={16}>
                {this.renderStateMachine()}
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
