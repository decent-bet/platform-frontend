import { BigNumber } from 'bignumber.js'
import { units } from 'ethereum-units'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as thunks from '../state/thunks'
import { Grid, Typography } from '@material-ui/core'
import SlotsList from './SlotsList'
import StateChannelBuilder from './StateChannelBuilder'
import StateChannelTable from './StateChannelTable'
import StateChannelToolbar from './StateChannelToolbar'
import TransparentPaper from '../../common/components/TransparentPaper'
import './slots.css'
import { VIEW_SLOTS } from '../../routes'
import ConfirmationDialog from '../../common/components/ConfirmationDialog'
import { ISlotsState, SlotsState } from './SlotsState'
import AppLoading from '../../common/components/AppLoading'
import { MIN_VTHO_AMOUNT } from '../../constants'

class Slots extends React.Component<any, ISlotsState> {
    constructor(props: any) {
        super(props)
        this.state = new SlotsState()

        this.isChannelClaimed = this.isChannelClaimed.bind(this)
        this.onCloseMinVTHODialog = this.onCloseMinVTHODialog.bind(this)
        this.refreshChannels = this.refreshChannels.bind(this)
        this.onBuildChannelListener = this.onBuildChannelListener.bind(this)
        this.onUpdateBuildStatusListener = this.onUpdateBuildStatusListener.bind(
            this
        )
        this.onClaimChannelListener = this.onClaimChannelListener.bind(this)
        this.onGoToGameroomListener = this.onGoToGameroomListener.bind(this)
        this.renderStateChannelToolbar = this.renderStateChannelToolbar.bind(
            this
        )
        this.onClaimFromContract = this.onClaimFromContract.bind(this)
        this.renderLoadingState = this.renderLoadingState.bind(this)
        this.renderSelectChannelsState = this.renderSelectChannelsState.bind(
            this
        )
        this.renderCurrentBalanceNode = this.renderCurrentBalanceNode.bind(this)
        this.channelBalanceParser = this.channelBalanceParser.bind(this)
        this.renderSelectGameState = this.renderSelectGameState.bind(this)
        this.renderChannelTable = this.renderChannelTable.bind(this)
        this.renderStateMachine = this.renderStateMachine.bind(this)
        this.renderSelectGameState = this.renderSelectGameState.bind(this)
        this.renderListGamesState = this.renderListGamesState.bind(this)
        this.renderClaimingStatus = this.renderClaimingStatus.bind(this)
    }

    public async componentDidMount() {
        if (this.props.slotsInitialized) {
            this.setState({ stateMachine: 'loading' })
            await this.props.initializeSlots()
            await this.refreshChannels()
        } else {
            this.setState({ stateMachine: 'list_games' })
        }
    }

    public componentWillUnmount() {
        this.setState(new SlotsState())
    }

    public async componentDidUpdate(prevProps, prevState) {
        if (this.props.slotsInitialized !== prevProps.slotsInitialized) {
            this.setState({ stateMachine: 'loading' })
            await this.props.initializeSlots()
            await this.refreshChannels()
        }
    }

    /**
     * Has the channel been claimed?
     * @param {any} channel
     * @returns {boolean}
     */
    private isChannelClaimed(channel: any): boolean {
        if (!channel.info) return false
        return (
            channel.info.finalized && channel.deposited.isLessThanOrEqualTo(0)
        )
    }

    private onCloseMinVTHODialog() {
        this.setState({ minVTHOdialogIsOpen: false })
    }

    private async refreshChannels(): Promise<void> {
        // Get channels and wait
        this.setState({
            stateMachine: 'loading',
            buildStatus: 'Fetching channels...'
        })

        const result = await this.props.fetchChannels()
        const channels: any[] = result.value

        // Make a list of all usable channels for the user and publish it
        const activeChannels: any[] = []
        const nonDepositedChannels: any[] = []
        const claimableChannels: any[] = []

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
                stateMachine: 'select_game',
                currentChannel: activeChannels[0]
            })
        } else if (nonDepositedChannels.length >= 1) {
            // Continue building channel
            const channel = nonDepositedChannels[0]

            // Update UI. Tell the user we are building the channel
            this.setState({
                stateMachine: 'building_game',
                buildStatus: 'Building the game...'
            })

            // Create the channel
            this.setState({
                stateMachine: 'loading',
                buildStatus: 'Making deposit into created channel...'
            })
            const currentChannel = this.props.depositIntoCreatedChannel(
                channel,
                this.onUpdateBuildStatusListener
            )

            // Update UI
            this.setState({ stateMachine: 'select_game', currentChannel })
        } else {
            // Ask the user to either select a channel or create a new one
            this.setState({ stateMachine: 'select_channels' })
        }
    }

    // Builds the entire State Channel in one Step
    private async onBuildChannelListener(amount) {
        const parsedAmount = new BigNumber(amount)

        // Update UI. Tell the user we are building the channel
        this.setState({ stateMachine: 'building_game' })

        // Create the channel
        const currentChannel = await this.props.initChannel(
            parsedAmount,
            this.onUpdateBuildStatusListener
        )

        // Update UI
        this.setState({ stateMachine: 'select_game', currentChannel })
    }

    private onUpdateBuildStatusListener(buildStatus) {
        this.setState({ buildStatus })
    }

    // Claims the tokens from a Channel
    private async onClaimChannelListener(channelId): Promise<void> {
        if (this.props.vthoBalance < MIN_VTHO_AMOUNT) {
            this.setState({ minVTHOdialogIsOpen: true })
        } else {
            this.setState({
                stateMachine: 'claiming',
                claimingChannel: channelId
            })
            await this.props.claimAndWithdrawFromChannel(channelId)
            // Refresh UI
            await this.refreshChannels()
        }
    }

    private onGoToGameroomListener(gameName): void {
        location.href = `${VIEW_SLOTS}${this.state.currentChannel}/${gameName}`
    }

    /**
     * Renders the buttons for each State Channel Row in the Table
     */
    private renderStateChannelToolbar(channel) {
        return (
            <Grid container={true} direction="row">
                <Grid item={true} xs={12}>
                    <StateChannelToolbar
                        channel={channel}
                        onClaimChannelListener={this.onClaimChannelListener}
                    />
                </Grid>
            </Grid>
        )
    }

    private renderLoadingState(message?: any, children?: any) {
        return (
            <AppLoading
                message={message ? message : this.state.buildStatus}
                children={children}
            />
        )
    }

    private renderSelectChannelsState() {
        return (
            <Grid container={true} direction="row" spacing={24}>
                <Grid item={true} xs={12}>
                    {this.renderChannelTable()}
                </Grid>
                <Grid item={true} xs={12}>
                    <StateChannelBuilder
                        onBuildChannelListener={this.onBuildChannelListener}
                        tokenBalance={this.props.tokenBalance}
                        vthoBalance={this.props.vthoBalance}
                    />
                </Grid>
            </Grid>
        )
    }

    private async onClaimFromContract(): Promise<void> {
        if (this.props.vthoBalance < MIN_VTHO_AMOUNT) {
            this.setState({ minVTHOdialogIsOpen: true })
        } else {
            this.setState({
                stateMachine: 'claiming_from_contract'
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
    private channelBalanceParser(channel: any): string {
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

    private renderListGamesState() {
        return (
            <SlotsList
                balance={0}
                allowSelect={false}
                onGameSelectedListener={this.onGoToGameroomListener}
            />
        )
    }

    private renderSelectGameState() {
        const channel = this.props.channels[this.state.currentChannel]
        const balance: any = this.channelBalanceParser(channel) || 0

        return (
            <React.Fragment>
                {this.renderChannelTable()}
                <SlotsList
                    balance={balance}
                    allowSelect={true}
                    onGameSelectedListener={this.onGoToGameroomListener}
                />
            </React.Fragment>
        )
    }

    private renderChannelTable() {
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

    private renderCurrentBalanceNode() {
        return (
            <React.Fragment>
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
            </React.Fragment>
        )
    }
    private renderClaimingStatus() {
        let claimingTokens
        let claimingChannel: any
        if (this.state.claimingChannel) {
            claimingChannel = this.props.channels[this.state.claimingChannel]
        }

        const { finalBalances } = claimingChannel
        claimingTokens = finalBalances
            ? finalBalances.dividedBy(units.ether).toFixed()
            : 0

        return this.renderLoadingState(
            `Claiming ${claimingTokens} DBETs...`,
            this.renderCurrentBalanceNode()
        )
    }

    private renderStateMachine() {
        switch (this.state.stateMachine) {
            case 'loading':
                return this.renderLoadingState('Loading slots...')
            case 'select_channels':
                return this.renderSelectChannelsState()
            case 'building_game':
                return this.renderLoadingState()
            case 'list_games':
                return this.renderListGamesState()
            case 'select_game':
                return this.renderSelectGameState()
            case 'claiming_from_contract':
                const userBalance = new BigNumber(this.props.balance)
                    .dividedBy(units.ether)
                    .toFixed(2)
                return this.renderLoadingState(
                    `Withdrawing ${userBalance} DBETs from Smart Contract...`,
                    this.renderCurrentBalanceNode()
                )
            case 'claiming':
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

const mapStateToProps = state => Object.assign({}, state.casino, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const SlotsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Slots)

export default SlotsContainer
