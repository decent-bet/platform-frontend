import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MainAppBar from './MainAppBar'
import AppBarToolbar from './AppBarToolbar'
import MainRouter from './MainRouter'
import AppDrawer from './AppDrawer'
import ProviderSelector from './ProviderSelector'
import * as thunks from './state/thunks'
import './dashboard.css'
import { Grid, Fade, Paper } from '@material-ui/core'
import AppLoading from '../common/components/AppLoading'
import { VIEW_ACCOUNT, VIEW_ACCOUNT_NOTACTIVATED } from '../routes'

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
            if(this.props.location.pathname !== VIEW_ACCOUNT_NOTACTIVATED) {
                return <Redirect to={VIEW_ACCOUNT_NOTACTIVATED} />
            }
        } else if (!accountIsVerified || !accountHasAddress) {
            if(this.props.location.pathname !== VIEW_ACCOUNT) {
                return <Redirect to={VIEW_ACCOUNT} />
            }
        } 

        return (
                <Fade in={this.state.loaded} timeout={500}>
                    <Paper
                        square={false}
                        style={{
                            backgroundColor: 'transparent',
                            padding: 0,
                            boxShadow: 'none'
                        }}
                    >
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
                                    <MainRouter />
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
