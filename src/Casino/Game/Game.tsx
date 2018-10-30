import * as React from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography,
    Grid,
    Slide
} from '@material-ui/core'
import ethUnits from 'ethereum-units'
import { connect } from 'react-redux'
import * as Thunks from '../state/thunks'
import { CHANNEL_STATUS_FINALIZED, MIN_VTHO_AMOUNT } from '../../constants'
import ChannelDetail from './ChannelDetail'
import IFrame from './IFrame'
import BigNumber from 'bignumber.js'
import AppLoading from '../../common/components/AppLoading'
import './game.css'
import { VIEW_SLOTS } from 'src/routes'
import ConfirmationDialog from '../../common/components/ConfirmationDialog'

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        slotsController: any
    }
}

class Game extends React.PureComponent<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            loadingMessage: '',
            dialogIsOpen: false,
            isFinalizing: false,
            spinCallback: null
        }

        this.formatEther = this.formatEther.bind(this)
        this.renderGame = this.renderGame.bind(this)
        this.onIFrameLoad = this.onIFrameLoad.bind(this)
        this.setupSlotsController = this.setupSlotsController.bind(this)
        this.onIFrameLoad = this.onIFrameLoad.bind(this)
        this.initSubscriptions = this.initSubscriptions.bind(this)
        this.unsubscribeFromActiveSubscriptions = this.unsubscribeFromActiveSubscriptions.bind(
            this
        )
        this.subscribeToSpinResponses = this.subscribeToSpinResponses.bind(this)
        this.spin = this.spin.bind(this)
        this.getBalance = this.getBalance.bind(this)
        this.onSpinWithoutMinBalance = this.onSpinWithoutMinBalance.bind(this)
        this.onCloseDialog = this.onCloseDialog.bind(this)
        this.onFinalizeListener = this.onFinalizeListener.bind(this)
        this.subscribeToFinalizeResponses = this.subscribeToFinalizeResponses.bind(
            this
        )
        this.back = this.back.bind(this)
        this.renderGame = this.renderGame.bind(this)
        this.renderHeader = this.renderHeader.bind(this)
        this.renderChannelDetail = this.renderChannelDetail.bind(this)
    }

    public async componentDidMount() {
        this.setState({
            isLoading: true,
            loadingMessage: 'Loading the game...'
        })
        const { dispatch, channelId } = this.props

        await dispatch(Thunks.initializeGame(channelId))
        dispatch(Thunks.initializeWaiters(channelId))

        this.initSubscriptions()
        this.setupSlotsController()
        this.setState({ isLoading: false, isLoadingGame: true })
    }

    private setupSlotsController() {
        window.slotsController = {
            spin: this.spin,
            balances: this.getBalance,
            vthoBalance: this.props.vthoBalance,
            minVthoAmount: MIN_VTHO_AMOUNT,
            onSpinWithoutMinBalance: this.onSpinWithoutMinBalance
        }
    }

    public componentWillUnmount() {
        this.unsubscribeFromActiveSubscriptions()
    }

    private formatEther(ether): string {
        const units = ethUnits.units.ether

        return new BigNumber(ether).dividedBy(units).toFixed(2)
    }

    private onIFrameLoad() {
        this.setState({ isLoadingGame: false, loadingMessage: '' })
    }

    private initSubscriptions(): void {
        this.subscribeToSpinResponses()
        this.subscribeToFinalizeResponses()
    }

    private unsubscribeFromActiveSubscriptions() {
        const { dispatch } = this.props
        dispatch(Thunks.unsubscribeFromActiveSubscriptions())
    }

    private subscribeToSpinResponses() {
        const { dispatch, channelId } = this.props

        const onSpinResponseListener = (
            err,
            msg,
            houseSpin,
            userSpin,
            lines
        ) => {
            if (!err) {
                console.log('onSpinResponseListener', this.props.houseSpins)
                let isValidHouseSpin = dispatch(
                    Thunks.verifyHouseSpin(this.props, houseSpin, userSpin)
                )
                if (isValidHouseSpin) listener(err, msg, lines)
            }
        }

        const listener = (err, msg, lines) => {
            if (!err) {
                let originalBalances = this.getBalance()
                dispatch(Thunks.spinAndIncreaseNonce(channelId, msg))
                let updatedBalances = this.getBalance()
                if (window.slotsController.onSpinEvent)
                    window.slotsController.onSpinEvent(
                        lines,
                        originalBalances,
                        updatedBalances
                    )
                if (this.state.spinCallback) {
                    this.state.spinCallback(err, msg, lines, updatedBalances)
                    this.setState({ spinCallback: null })
                }
            }
        }

        dispatch(Thunks.subscribeToSpinResponses(onSpinResponseListener))
    }

    private spin(lines, betSize, callback) {
        const { dispatch } = this.props
        const totalBetSize = lines * betSize

        dispatch(Thunks.spin(totalBetSize, this.props))
        this.setState({ spinCallback: callback })
    }

    private getBalance() {
        return {
            user: this.formatEther(this.props.userBalance),
            house: this.formatEther(this.props.houseBalance)
        }
    }

    private onSpinWithoutMinBalance() {
        this.setState({ dialogIsOpen: true })
    }

    private onCloseDialog() {
        this.setState({ dialogIsOpen: false })
    }

    private async onFinalizeListener() {
        this.setState({ isFinalizing: true, loadingMessage: 'Exiting...' })
        await this.props.dispatch(
            Thunks.finalizeChannel(this.props.channelId, this.props)
        )
    }

    private subscribeToFinalizeResponses() {
        const { dispatch } = this.props

        const onFinalizeResponseListener = (err, msg) => {
            if (!err) {
                this.back()
            }
        }

        dispatch(
            Thunks.subscribeToFinalizeResponses(onFinalizeResponseListener)
        )
    }

    /**
     * Go to the previous page
     */
    private back() {
        this.props.history.push(VIEW_SLOTS)
    }

    private renderGame() {
        if (this.props.status === CHANNEL_STATUS_FINALIZED) {
            return (
                <Card className="card full-size">
                    <CardHeader title="The channel has been finalized" />
                    <CardContent>
                        <Typography>
                            Please wait a minute before claiming your DBETs.
                        </Typography>
                        <Typography>
                            Final Balance:{' '}
                            {this.formatEther(this.props.userBalance)}
                        </Typography>
                    </CardContent>
                </Card>
            )
        } else if (this.props.lastSpinLoaded) {
            const game = this.props.match.params.gameName || 'game'
            const path = `${
                process.env.PUBLIC_URL
            }/slots-${game}/game/index.html`

            return (
                <React.Fragment>
                    {this.state.isLoadingGame ? (
                        <AppLoading message={this.state.loadingMessage} />
                    ) : null}
                    <Slide
                        direction="up"
                        in={!this.state.isLoadingGame}
                        timeout={1000}
                    >
                        <IFrame
                            title="Slots Game"
                            onLoad={this.onIFrameLoad}
                            id="slots-IFrame"
                            src={path}
                            width="100%"
                            height="100%"
                            allowFullScreen={true}
                        />
                    </Slide>
                </React.Fragment>
            )
        } else {
            return <AppLoading message={this.state.loadingMessage} />
        }
    }

    private renderChannelDetail() {
        if (this.props.info) {
            return (
                <ChannelDetail
                    initialDeposit={this.props.info.initialDeposit}
                    hashes={this.props.hashes}
                    houseSpins={this.props.houseSpins}
                    userHashes={this.props.userHashes}
                />
            )
        }

        return null
    }

    private renderHeader() {
        return (
            <Grid
                container={true}
                direction="row"
                style={{ paddingLeft: '1.5em', paddingRight: '1.5em' }}
                justify="space-between"
                spacing={40}
            >
                <Grid item={true}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.back}
                    >
                        Lobby
                    </Button>
                </Grid>
                <Grid item={true}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onFinalizeListener}
                        disabled={
                            this.props.status === CHANNEL_STATUS_FINALIZED
                        }
                    >
                        Exit Slots
                    </Button>
                </Grid>
            </Grid>
        )
    }

    public render() {
        if (this.state.isFinalizing || this.state.isLoading) {
            // If finalizing, print simple placeholder
            return <AppLoading message={this.state.loadingMessage} />
        } else {
            // Show normal page
            return (
                <React.Fragment>
                    <ConfirmationDialog
                        title="Minimum VTHO balance"
                        content="VTHO balance is too low to complete the transaction. Please ensure you have over 7500 VTHO to complete the transaction."
                        open={this.state.dialogIsOpen}
                        onClickOk={this.onCloseDialog}
                        onClose={this.onCloseDialog}
                    />
                    {this.renderHeader()}

                    <Grid
                        container={true}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        spacing={40}
                    >
                        <Grid
                            item={true}
                            xs={12}
                            style={{
                                height: 600,
                                maxWidth: 1300,
                                width: '100%',
                                marginBottom: '2em',
                                paddingLeft: '2em',
                                paddingRight: '2em'
                            }}
                        >
                            {this.renderGame()}
                        </Grid>
                        <Grid
                            item={true}
                            xs={12}
                            style={{
                                paddingLeft: '2.5em',
                                paddingRight: '2.5em',
                                width: '100%'
                            }}
                        >
                            {this.renderChannelDetail()}
                        </Grid>
                    </Grid>
                </React.Fragment>
            )
        }
    }
}

export default connect((state: any, props: any) => {
    // This component's props is the data of a single State Channel,
    // whose ID is defined in `props.match.params.id`
    let channelId = props.match.params.id
    let channelData = state.casino.channels[channelId]
    if (!channelData) {
        channelData = {}
    }
    channelData.channelId = channelId

    // Get the Balances for the House and the user. Set them as 'initialDeposit' if nothing is found
    if (!channelData.info) {
        // Default Values
        channelData.userBalance = 0
        channelData.houseBalance = 0
    } else {
        // Default values if the `info` is already loaded
        channelData.userBalance = channelData.info.initialDeposit
        channelData.houseBalance = channelData.info.initialDeposit
        if (channelData.houseSpins && channelData.nonce) {
            let lastIdx = channelData.houseSpins.length - 1
            let lastHouseSpin = channelData.houseSpins[lastIdx]
            if (channelData.nonce !== 1) {
                // Real Values if there has been at least a spin
                channelData.userBalance = lastHouseSpin.userBalance
                channelData.houseBalance = lastHouseSpin.houseBalance
            }
        }
    }

    channelData.vthoBalance = state.casino.vthoBalance.toFixed(5)

    return channelData
})(Game)