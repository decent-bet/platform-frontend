import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {
    Grid,
    CssBaseline,
    MuiThemeProvider,
    Snackbar
} from '@material-ui/core'
import Main from '../Main'
import Auth from '../Auth'
import Logout from '../Logout'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import AppLoading from '../common/components/AppLoading'
import EventBus from 'eventing-bus'
import DarkTheme from '../common/themes/dark'
import { VIEW_LOGOUT, VIEW_MAIN, VIEW_AUTH } from '../routes'
import * as thunks from '../common/state/thunks'

class App extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    public state = {
        snackbarMessage: null,
        isSnackBarOpen: false,
        appLoaded: false
    }

    public async componentDidMount() {
        await this.props.setHttpAuthBaseUrl()
        await this.props.setUserAuthenticationStatus()

        EventBus.on('showSnackbar', message => {
            this.setState({
                isSnackBarOpen: true,
                snackbarMessage: message
            })
        })
        this.setState({ appLoaded: true })
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
                            <Route
                                exact={true}
                                path={VIEW_LOGOUT}
                                component={Logout}
                            />
                            <PublicRoute
                                path={VIEW_AUTH}
                                component={Auth}
                                userIsAuthenticated={
                                    this.props.userIsAuthenticated
                                }
                            />
                            <PrivateRoute
                                path={VIEW_MAIN}
                                component={Main}
                                userIsAuthenticated={
                                    this.props.userIsAuthenticated
                                }
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

    public render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <MuiThemeProvider theme={DarkTheme}>
                    {this.state.appLoaded === true ? (
                        this.renderRoutes()
                    ) : (
                        <AppLoading />
                    )}
                </MuiThemeProvider>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.app)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
export default AppContainer
