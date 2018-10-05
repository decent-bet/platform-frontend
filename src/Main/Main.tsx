import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MainAppBar from './MainAppBar'
import AppBarToolbar from './AppBarToolbar'
import MainRouter from './MainRouter'
import AppDrawer from './AppDrawer'
import ProviderSelector from './ProviderSelector'
import { Redirect } from 'react-router-dom'
import { VIEW_PROFILE, VIEW_MAIN } from '../routes'
import * as thunks from './state/thunks'
import './dashboard.css'
import { Grid, Fade, Paper } from '@material-ui/core'
import AppLoading from '../common/components/AppLoading'

class Main extends React.Component<any> {
    public state = {
        currentStage: '',
        drawerOpen: false,
        loaded: false
    }

    public async componentDidMount() {
        await this.props.initializeMain()
        this.setState({ loaded: true })
    }

    // Faucet Button Clicked. Execute Faucet
    private onFaucetClickedListener = async () => {
        this.onToggleDrawerListener()
        await this.props.faucet()
    }

    // private onDrawerButtonPressedListener = open => this.setState({ drawerOpen: open })
    private onDrawerCloseListener = () => this.setState({ drawerOpen: false })

    private onStageChangeListener = value => {
        if (value !== this.state.currentStage) {
            this.props.history.push('/logout')
        }
    }

    private onToggleDrawerListener = () =>
        this.setState({ drawerOpen: !this.state.drawerOpen })

    private onViewChangeListener = newView => {
        if (this.props.location.pathname === newView) return
        this.setState({ drawerOpen: false })
        this.props.history.push(newView)
    }

    private get isBasicProfileVerified() {
        const { profile } = this.props
        return (
            profile &&
            profile.basicVerification &&
            (profile.basicVerification.verified &&
                profile.basicVerification.verified === true)
        )
    }

    public render() {
        if (
            !this.isBasicProfileVerified &&
            this.props.location.pathname !== VIEW_PROFILE
        ) {
            return <Redirect exact={true} from={VIEW_MAIN} to={VIEW_PROFILE} />
        }

        const { profile } = this.props

        return (
            <React.Fragment>
                {!this.state.loaded ? <AppLoading /> : null}
                <Fade
                    in={this.state.loaded}
                    timeout={500}
                >
                    <Paper square={false} style={{
                        backgroundColor: 'transparent',
                        padding: 0,
                        boxShadow: 'none'
                    }}>
                        <MainAppBar
                            onToggleDrawerListener={this.onToggleDrawerListener}
                        >
                            <AppBarToolbar
                                address={this.props.address}
                                tokenBalance={this.props.balance}
                                etherBalance={this.props.etherBalance}
                            />
                        </MainAppBar>
                        <Grid
                            style={{ marginTop: '80px' }}
                            container={true}
                            direction="row"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item={true} xs={12} sm={10} md={8}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <MainRouter profile={profile} />
                            </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <AppDrawer
                            isDrawerOpen={this.state.drawerOpen}
                            onDrawerCloseListener={this.onDrawerCloseListener}
                            onViewChangeListener={this.onViewChangeListener}
                            selectedView={this.props.location.pathname}
                            onFaucetClickedListener={
                                this.onFaucetClickedListener
                            }
                        >
                            <ProviderSelector
                                onStageChangeListener={
                                    this.onStageChangeListener
                                }
                                currentStage={this.state.currentStage}
                            />
                        </AppDrawer>
                    </Paper>
                </Fade>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const MainContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)
export default MainContainer
