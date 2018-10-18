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
import { Grid, Fade } from '@material-ui/core'
import AppLoading from '../common/components/AppLoading'
import { VIEW_ACCOUNT, VIEW_ACCOUNT_NOTACTIVATED } from '../routes'

class Main extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            drawerOpen: false,
            loaded: false
        }

        this.onCopyAddress = this.onCopyAddress.bind(this)
    }

    public async componentDidMount() {
        await this.props.initializeMain()
        this.setState({ loaded: true })
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

    private onCopyAddress() {
        this.props.openAlert('Copied address to clipboard', 'info')
    }

    public render() {
        if (!this.state.loaded) {
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

        return (
            <Fade in={this.state.loaded} timeout={500}>
                <React.Fragment>
                    <MainAppBar
                        onToggleDrawerListener={this.onToggleDrawerListener}
                    >
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
                    </MainAppBar>
                    <Grid
                        style={{ marginTop: '80px', marginBottom: '80px' }}
                        container={true}
                        direction="row"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item={true} xs={12}>
                            <MainRouter />
                        </Grid>
                    </Grid>
                    <AppDrawer
                        isDrawerOpen={this.state.drawerOpen}
                        onDrawerCloseListener={this.onDrawerCloseListener}
                        onViewChangeListener={this.onViewChangeListener}
                        selectedView={this.props.location.pathname}
                        onFaucetClickedListener={this.onFaucetClickedListener}
                    />
                </React.Fragment>
            </Fade>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.main, state.casino)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks, { openAlert, faucet }), dispatch)

const MainContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)
export default MainContainer
