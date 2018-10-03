import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {
    Grid,
    CssBaseline,
    MuiThemeProvider,
    Snackbar,
    CircularProgress
} from '@material-ui/core'
import Dashboard from '../Dashboard'
import Auth from '../Auth'
import Logout from '../Logout'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import EventBus from 'eventing-bus'
import { DarkTheme } from '../common/themes/dark'
import { VIEW_LOGOUT } from '../routes'
import * as thunks from '../common/state/thunks'

class App extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    public state = {
        snackbarMessage: null,
        isSnackBarOpen: false,
        stateMachine: 'loading'
    }

    public async componentDidMount() {
        await this.props.userIsLoggedIn()
        EventBus.on('showSnackbar', message => {
            this.setState({
                isSnackBarOpen: true,
                snackbarMessage: message
            })
        })
        this.setState({ stateMachine: 'loaded' })
    }

    private onCloseSnackBar = () => {
        this.setState({
            isSnackBarOpen: false,
            snackbarMessage: ''
        })
    }

    private renderRoutes = () => {
        return (
            <Grid
                container={true}
                direction="row"
                alignItems="center"
                alignContent="center"
                justify="center"
            >
                <Grid
                    item={true}
                    xs={12}
                    style={{ paddingLeft: '2em', paddingRight: '2em' }}
                >
                    <BrowserRouter>
                        <Switch>
                            <Route path={VIEW_LOGOUT} component={Logout} />
                            <PublicRoute
                                component={Auth}
                                isLoggedIn={this.props.isLoggedIn}
                            />
                            <PrivateRoute
                                exact={true}
                                component={Dashboard}
                                isLoggedIn={this.props.isLoggedIn}
                            />
                        </Switch>
                    </BrowserRouter>
                    <Snackbar
                        onClose={this.onCloseSnackBar}
                        message={this.state.snackbarMessage}
                        open={this.state.isSnackBarOpen}
                        autoHideDuration={6000}
                    />
                </Grid>
            </Grid>
        )
    }

    private renderLoading = () => {
        return (
            <Grid
                container={true}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ height: '100vh' }}
            >
                <Grid container={true} direction="column" alignItems="center">
                    <Grid item={true} xs={12}>
                        <CircularProgress/>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
    public render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <MuiThemeProvider theme={DarkTheme}>
                    {this.state.stateMachine === 'loaded'
                        ? this.renderRoutes()
                        : this.renderLoading()}
                </MuiThemeProvider>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.main)
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign(
        {},
        thunks
    ), dispatch)

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)
export default AppContainer
