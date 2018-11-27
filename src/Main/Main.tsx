import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import MainAppBar from './MainAppBar'
import AppBarToolbar from './AppBarToolbar'
import MainRouter from './MainRouter'
import AppDrawer from './AppDrawer'
import * as thunks from './state/thunks'
import { faucet } from '../Casino/state/thunks'
import { openAlert } from '../common/state/thunks'
import './main.css'
import { Grid, Fade, Typography } from '@material-ui/core'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import AppLoading from '../common/components/AppLoading'
import { VIEW_ACCOUNT, VIEW_ACCOUNT_NOTACTIVATED } from '../routes'

class Main extends React.Component<any, any> {
    private _activationTimer: any

    constructor(props: any) {
        super(props)
        this.state = {
            drawerOpen: false,
            loaded: false
        }

        this.onCopyAddress = this.onCopyAddress.bind(this)
        this.renderError = this.renderError.bind(this)
    }

    public async componentDidMount() {
        await this.props.initializeMain()

        if (!this.props.accountIsActivated) {
            this._activationTimer = setInterval(async () => {
                await this.props.initializeMain()
            }, 5000)
        }

        this.setState({ loaded: true })
    }

    public componentWillUnmount() {
        if (this._activationTimer) {
            clearInterval(this._activationTimer)
        }
    }

    public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        if (
            this.state.loaded !== nextState.loaded ||
            this.state.drawerOpen !== nextState.drawerOpen ||
            this.props.accountIsActivated !== nextProps.accountIsActivated ||
            this.props.accountIsActivated !== nextProps.accountIsActivated ||
            this.props.accountIsVerified !== nextProps.accountIsVerified ||
            this.props.accountHasAddress !== nextProps.accountHasAddress ||
            this.props.isCasinoLogedIn !== nextProps.isCasinoLogedIn ||
            this.props.location.pathname !== nextProps.location.pathname ||
            this.props.error !== nextProps.error ||
            this.props.width !== nextProps.width ||
            this.props.tokenBalance !== nextProps.tokenBalance ||
            this.props.vthoBalance !== nextProps.vthoBalance
        ) {
            return true
        }

        return false
    }

    // Faucet Button Clicked. Execute Faucet
    private onFaucetClickedListener = async () => {
        this.props.faucet()
        this.onToggleDrawerListener()
    }

    private onDrawerCloseListener = () => this.setState({ drawerOpen: false })

    private onToggleDrawerListener = () =>
        this.setState({ drawerOpen: !this.state.drawerOpen })

    private onViewChangeListener = newView => {
        if (this.props.location.pathname === newView) return
        this.setState({ drawerOpen: false })
        this.props.history.push(newView)
    }

    private onCopyAddress(): void {
        this.props.openAlert('Copied address to clipboard', 'info')
    }

    private renderError() {
        return <Typography>{this.props.errorMessage}</Typography>
    }

    public render() {
        if (!this.state.loaded && !this.props.error) {
            return <AppLoading />
        }

        const {
            accountIsActivated,
            accountIsVerified,
            accountHasAddress
        } = this.props

        if (!accountIsActivated) {
            if (this.props.location.pathname !== VIEW_ACCOUNT_NOTACTIVATED) {
                return <Redirect to={VIEW_ACCOUNT_NOTACTIVATED} />
            }
        } else if (!accountIsVerified || !accountHasAddress) {
            if (this.props.location.pathname !== VIEW_ACCOUNT) {
                return <Redirect to={VIEW_ACCOUNT} />
            }
        }

        if (accountIsActivated) {
            if (this._activationTimer) {
                clearInterval(this._activationTimer)
            }

            if (this.props.location.pathname === VIEW_ACCOUNT_NOTACTIVATED) {
                return <Redirect to={VIEW_ACCOUNT} />
            }
        }

        return (
            <Fade in={this.state.loaded || this.props.error} timeout={500}>
                <React.Fragment>
                    <MainAppBar
                        onToggleDrawerListener={this.onToggleDrawerListener}
                    >
                        {isWidthDown('sm', this.props.width) ? null : (
                            <AppBarToolbar
                                accountHasAddress={accountHasAddress}
                                isCasinoLogedIn={this.props.isCasinoLogedIn}
                                onCopyAddress={this.onCopyAddress}
                                address={
                                    this.props.accountHasAddress
                                        ? this.props.account.verification
                                              .addressRegistration.vetAddress
                                        : ''
                                }
                                tokenBalance={this.props.tokenBalance}
                                vthoBalance={this.props.vthoBalance}
                            />
                        )}
                    </MainAppBar>
                    <Grid
                        style={{ marginTop: '80px', marginBottom: '80px' }}
                        container={true}
                        direction="row"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid
                            item={true}
                            xs={12}
                            style={{
                                paddingLeft: '1.5em',
                                paddingRight: '1.5em'
                            }}
                        >
                            <MainRouter />
                        </Grid>
                    </Grid>
                    <AppDrawer
                        isDrawerOpen={this.state.drawerOpen}
                        onDrawerCloseListener={this.onDrawerCloseListener}
                        onViewChangeListener={this.onViewChangeListener}
                        selectedView={this.props.location.pathname}
                        onFaucetClickedListener={this.onFaucetClickedListener}
                        accountHasAddress={accountHasAddress}
                        isCasinoLogedIn={this.props.isCasinoLogedIn}
                        onCopyAddress={this.onCopyAddress}
                        address={
                            this.props.accountHasAddress
                                ? this.props.account.verification
                                      .addressRegistration.vetAddress
                                : ''
                        }
                        tokenBalance={this.props.tokenBalance}
                        vthoBalance={this.props.vthoBalance}
                    />
                </React.Fragment>
            </Fade>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.main, state.casino)
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        Object.assign({}, thunks, { openAlert, faucet }),
        dispatch
    )

const MainContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)
export default withWidth()(MainContainer)
