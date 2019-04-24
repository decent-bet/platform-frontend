import { BigNumber } from 'bignumber.js'
import { units } from 'ethereum-units'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import * as thunks from '../state/thunks'
import { Grid, Typography } from '@material-ui/core'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelTable from './StateChannelTable'
import StateChannelToolbar from './StateChannelToolbar'
import HouseStatus from './HouseStatus'
import TransparentPaper from '../../common/components/TransparentPaper'
import Routes from '../../routes'
import ConfirmationDialog from '../../common/components/ConfirmationDialog'
import { ISlotsState, SlotsState, SlotsStateMachine } from './ISlotsState'
import { IChannel } from '../state/IChannel'
import AppLoading from '../../common/components/AppLoading'
import { MIN_VTHO_AMOUNT } from '../../constants'
import { ICasinoState } from '../state/ICasinoState'

import './slots.css'

// This typings need to be inherited from the Redux State
interface ISlotProps extends ICasinoState {
    [id: string]: any
}

class Slots extends Component<ISlotProps, ISlotsState> {
    public state = SlotsState

    public async componentDidMount() {
        if (this.props.slotsInitialized) {
            this.setState({ stateMachine: SlotsStateMachine.Loading })
            await this.props.initializeSlots()
            await this.refreshChannels()
        } else {
            this.setState({ stateMachine: SlotsStateMachine.ListGames })
        }
    }

    public componentWillUnmount() {
        this.setState(SlotsState)
    }

    public async componentDidUpdate(prevProps, prevState) {
        if (this.props.slotsInitialized !== prevProps.slotsInitialized) {
            this.setState({ stateMachine: SlotsStateMachine.Loading })
            await this.props.initializeSlots()
            await this.refreshChannels()
        }
    }

    /**
     * Has the channel been claimed?
     * @param {IChannel} channel
     * @returns {boolean}
     */
    private isChannelClaimed = (channel: IChannel): boolean => {
        if (!channel.info) return false
        return (
            channel.info.finalized && channel.deposited.isLessThanOrEqualTo(0)
        )
    }

    private onCloseMinVTHODialog = () => {
        this.setState({ minVTHOdialogIsOpen: false })
    }

    private refreshChannels = async () => {
        // Get channels and wait
        this.setState({
            stateMachine: SlotsStateMachine.Loading,
            buildStatus: 'Fetching channels...'
        })

        const result = await this.props.fetchChannels()
        const channels: IChannel[] = result.value

        // Make a list of all usable channels for the user and publish it
        const activeChannels: string[] = []
        const nonDepositedChannels: string[] = []
        const claimableChannels: string[] = []

        if (channels) {
            for (const channelId in channels) {
                if (channels.hasOwnProperty(channelId)) {
                    const channel = channels[channelId]

                    // Is channel still usable?
                    const isUsable =
                        channel.info &&
                        channel.info.ready &&
                        channel.info.activated &&
                        !channel.info.finalized
                    if (isUsable) activeChannels.push(channelId)

                    // Channel has not been deposited into yet, continue building channel
                    const isNotReady =
                        channel.info &&
                        !channel.info.ready &&
                        !channel.info.activated &&
                        !channel.info.finalized

                    if (isNotReady) nonDepositedChannels.push(channelId)

                    if (
                        channel.info.finalized &&
                        !this.isChannelClaimed(channel)
                    )
                        claimableChannels.push(channelId)
                }
            }
        }

        this.setState({ activeChannels, claimableChannels })

        // If there is exactly one usable channel active, switch to it.
        if (activeChannels.length === 1) {
            this.setState({
                stateMachine: SlotsStateMachine.SelectGame,
                currentChannel: activeChannels[0]
            })
        } else if (nonDepositedChannels.length >= 1) {
            // Continue building channel
            const channel = nonDepositedChannels[0]

            // Update UI. Tell the user we are building the channel
            this.setState({
                stateMachine: SlotsStateMachine.BuildingGame,
                buildStatus: 'Building the game...'
            })

            // Create the channel
            this.setState({
                stateMachine: SlotsStateMachine.Loading,
                buildStatus: 'Making deposit into created channel...'
            })
            const currentChannel = this.props.depositIntoCreatedChannel(
                channel,
                this.onUpdateBuildStatusListener
            )

            // Update UI
            this.setState({
                stateMachine: SlotsStateMachine.SelectGame,
                currentChannel
            })
        } else {
            // Ask the user to either select a channel or create a new one
            this.setState({ stateMachine: SlotsStateMachine.SelectChannels })
        }
    }

    // Builds the entire State Channel in one Step
    private onBuildChannelListener = async (amount: BigNumber) => {
        // Update UI. Tell the user we are building the channel
        this.setState({ stateMachine: SlotsStateMachine.BuildingGame })

        // Create the channel
        const currentChannel = await this.props.initChannel(
            amount,
            this.onUpdateBuildStatusListener
        )

        // Update UI
        this.setState({
            stateMachine: SlotsStateMachine.SelectGame,
            currentChannel
        })
    }

    private onUpdateBuildStatusListener = buildStatus => {
        this.setState({ buildStatus })
    }

    // Claims the tokens from a Channel
    private onClaimChannelListener = async (channelId: string) => {
        if (this.props.vthoBalance < MIN_VTHO_AMOUNT) {
            this.setState({ minVTHOdialogIsOpen: true })
        } else {
            this.setState({
                stateMachine: SlotsStateMachine.Claiming,
                claimingChannel: channelId
            })
            await this.props.claimAndWithdrawFromChannel(channelId)
            // Refresh UI
            await this.refreshChannels()
        }
    }

    private onGoToGameroomListener = (gameName: string) => {
        location.href = `${Routes.Slots}${
            this.state.currentChannel
        }/${gameName}`
    }

    /**
     * Renders the buttons for each State Channel Row in the Table
     */
    private renderStateChannelToolbar = (channel: IChannel) => (
        <Grid container={true} direction="row">
            <Grid item={true} xs={12}>
                <StateChannelToolbar
                    channel={channel}
                    onClaimChannelListener={this.onClaimChannelListener}
                />
            </Grid>
        </Grid>
    )

    private renderLoadingState = (message?: string, children?: JSX.Element) => (
        <AppLoading
            message={message ? message : this.state.buildStatus}
            children={children}
        />
    )

    private renderSelectChannelsState = () => (
        <Grid container={true} direction="row" spacing={16} justify="center">
            <Grid item={true} xs={12}>
                {this.renderChannelTable()}
            </Grid>
            {/* <Grid item={true} xs={12} md={6} lg={8}>
                <StateChannelBuilder
                    onBuildChannelListener={this.onBuildChannelListener}
                    tokenBalance={this.props.tokenBalance}
                    vthoBalance={this.props.vthoBalance}
                />
            </Grid> */}
            <Grid item={true} xs={12} md={6} lg={4}>
                <HouseStatus
                    currentBalance={this.props.houseBalance}
                    monthlyBalance={this.props.houseMonthlyBalance}
                    initialDeposit={this.props.houseInitialDeposit}
                />
            </Grid>
        </Grid>
    )

    private onClaimFromContract = async () => {
        if (this.props.vthoBalance < MIN_VTHO_AMOUNT) {
            this.setState({ minVTHOdialogIsOpen: true })
        } else {
            this.setState({
                stateMachine: SlotsStateMachine.ClaimingFromContract
            })
            await this.props.claimDbetsFromContract()

            // Refresh UI
            await this.refreshChannels()
        }
    }

    /**
     * Parses the user's balance on a state channel
     * @param {any} channel
     */
    private channelBalanceParser = (channel: IChannel): string => {
        let initialDeposit =
            channel && channel.info
                ? new BigNumber(channel.info.initialDeposit)
                : 0

        let totalTokens = new BigNumber(initialDeposit)
        if (channel && channel.houseSpins && channel.houseSpins.length > 0) {
            const lastIdx = channel.houseSpins.length - 1
            const rawBalance = channel.houseSpins[lastIdx].userBalance
            totalTokens = new BigNumber(rawBalance)
        }

        const balance = totalTokens.dividedBy(units.ether).toFixed(2)
        return balance
    }

    private renderListGamesState = () => (
        <SlotsList
            balance={'0'}
            allowSelect={false}
            onGameSelectedListener={this.onGoToGameroomListener}
        />
    )

    private renderSelectGameState = () => {
        const channel = this.props.channels[this.state.currentChannel]
        const balance: string = this.channelBalanceParser(channel)

        return (
            <>
                {this.renderChannelTable()}
                <SlotsList
                    balance={balance}
                    allowSelect={true}
                    onGameSelectedListener={this.onGoToGameroomListener}
                />
            </>
        )
    }

    private renderChannelTable = () => {
        const userBalance = new BigNumber(this.props.balance)
            .dividedBy(units.ether)
            .toFixed(2)
        return (
            <Grid container={true} direction="row" spacing={40}>
                <Grid item={true} xs={12}>
                    <StateChannelTable
                        userBalance={userBalance}
                        onClaimFromContract={this.onClaimFromContract}
                        channelMap={this.props.channels}
                        claimableChannels={this.state.claimableChannels}
                        /* Function as a child. Receives `channel` */
                        channelProp={this.renderStateChannelToolbar}
                    />
                </Grid>
            </Grid>
        )
    }

    private renderCurrentBalanceNode = () => (
        <>
            <Typography align="center" variant="subtitle2">
                <Typography component="span">
                    Your current token balance is
                </Typography>
                <Typography
                    component="span"
                    color="primary"
                    variant="subtitle2"
                >
                    {this.props.tokenBalance.toFixed(2)}
                </Typography>
            </Typography>
        </>
    )

    private renderClaimingStatus = () => {
        // Null Protection
        if (!this.state.claimingChannel) return
        const claimingChannel: IChannel = this.props.channels[
            this.state.claimingChannel
        ]
        if (!claimingChannel) return

        const { finalBalances } = claimingChannel
        const claimingTokens = finalBalances
            ? finalBalances.dividedBy(units.ether).toFixed()
            : '0'

        return this.renderLoadingState(
            `Claiming ${claimingTokens} DBETs...`,
            this.renderCurrentBalanceNode()
        )
    }

    private renderStateMachine = () => {
        switch (this.state.stateMachine) {
            case SlotsStateMachine.Loading:
                return this.renderLoadingState('Loading slots...')
            case SlotsStateMachine.SelectChannels:
                return this.renderSelectChannelsState()
            case SlotsStateMachine.BuildingGame:
                return this.renderLoadingState()
            case SlotsStateMachine.ListGames:
                return this.renderListGamesState()
            case SlotsStateMachine.SelectGame:
                return this.renderSelectGameState()
            case SlotsStateMachine.ClaimingFromContract:
                const userBalance = new BigNumber(this.props.balance)
                    .dividedBy(units.ether)
                    .toFixed(2)
                return this.renderLoadingState(
                    `Withdrawing ${userBalance} DBETs from Smart Contract...`,
                    this.renderCurrentBalanceNode()
                )
            case SlotsStateMachine.Claiming:
                return this.renderClaimingStatus()
            default:
                return this.renderLoadingState()
        }
    }

    public render() {
        return (
            <Grid
                container={true}
                direction="row"
                spacing={24}
                justify="center"
                alignItems="center"
            >
                <Grid item={true} xs={12} style={{ maxWidth: 1300 }}>
                    <ConfirmationDialog
                        title="Minimum VTHO balance"
                        content={`VTHO balance is too low to complete the transaction. Please ensure you have over ${MIN_VTHO_AMOUNT} VTHO to complete the transaction.`}
                        open={this.state.minVTHOdialogIsOpen}
                        onClickOk={this.onCloseMinVTHODialog}
                        onClose={this.onCloseMinVTHODialog}
                    />
                    <TransparentPaper>
                        {this.renderStateMachine()}
                    </TransparentPaper>
                </Grid>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return { ...state.casino, ...state.main }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({ ...thunks }, dispatch)
}

const SlotsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Slots)

export default SlotsContainer
