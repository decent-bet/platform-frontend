import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import AppBarToolbar from './AppBarToolbar'
import MainRouter from './MainRouter'
import AppDrawer from './AppDrawer'
import * as thunks from './state/thunks'
import { faucet } from '../Casino/state/thunks'
import { openAlert } from '../common/state/thunks'
import './main.css'
import {
    Grid,
    Fade,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Hidden
} from '@material-ui/core'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import AppLoading from '../common/components/AppLoading'
import Routes from '../routes'
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import dbetLogo from '../assets/img/dbet-white.svg'
class Main extends Component<any, any> {
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

        if (!this.state.loaded) {
            this.setState({ loaded: true })
        }
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

        // validate activation
        if (accountIsActivated) {
            if (this._activationTimer) {
                clearInterval(this._activationTimer)
            }

            if (this.props.location.pathname === Routes.AccountNotActivated) {
                return <Redirect to={Routes.AccountAddress} />
            }

            // validate account verification
            if (
                !accountIsVerified &&
                ![Routes.AccountAddress, Routes.AccountInfo].includes(
                    this.props.location.pathname
                )
            ) {
                return <Redirect to={Routes.AccountAddress} />
            }

            // validate account address
            if (
                !accountHasAddress &&
                this.props.location.pathname !== Routes.AccountAddress
            ) {
                return <Redirect to={Routes.AccountAddress} />
            }
        } else {
            if (this.props.location.pathname !== Routes.AccountNotActivated) {
                return <Redirect to={Routes.AccountNotActivated} />
            }
        }

        const isXl = isWidthUp('xl', this.props.width)
        const drawerWidth = 240
        return (
            <Fade in={this.state.loaded || this.props.error} timeout={500}>
                <React.Fragment>
                    <AppBar
                        className="appbar"
                        position="fixed"
                        style={{ zIndex: isXl ? 1201 : 1100 }}
                    >
                        <Toolbar>
                            <Hidden xlUp={true}>
                                <IconButton
                                    aria-label="Menu"
                                    onClick={this.onToggleDrawerListener}
                                    style={{
                                        marginLeft: -12,
                                        marginRight: 20
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Hidden>

                            <Link to="/" className="logo-container">
                                <img
                                    src={dbetLogo}
                                    className="logo"
                                    alt="Decent.bet"
                                />
                            </Link>
                            <Hidden smDown={true}>
                                <AppBarToolbar
                                    accountHasAddress={accountHasAddress}
                                    isCasinoLogedIn={this.props.isCasinoLogedIn}
                                    onCopyAddress={this.onCopyAddress}
                                    address={
                                        this.props.accountHasAddress
                                            ? this.props.account.verification
                                                  .addressRegistration
                                                  .vetAddress
                                            : ''
                                    }
                                    tokenBalance={this.props.tokenBalance}
                                    vthoBalance={this.props.vthoBalance}
                                />
                            </Hidden>
                        </Toolbar>
                    </AppBar>
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
                                paddingRight: '1.5em',
                                marginRight: isXl ? -drawerWidth : 0
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
                        drawerWidth={drawerWidth}
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
