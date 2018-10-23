import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Grid, CssBaseline, MuiThemeProvider } from '@material-ui/core'
import Main from '../Main'
import Auth from '../Auth'
import ActivateAccount from '../ActivateAccount'
import Logout from '../Logout'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import DarkTheme from '../common/themes/dark'
import {
    VIEW_LOGOUT,
    VIEW_MAIN,
    VIEW_AUTH,
    VIEW_ACTIVATE_ACCOUNT
} from '../routes'
import {
    setAppLoaded,
    setUserAuthenticationStatus,
    closeAlert
} from '../common/state/thunks'
import AppLoading from '../common/components/AppLoading'
import TransparentPaper from '../common/components/TransparentPaper'
import Alert from '../common/components/Alert'
import ErrorBoundary from './ErrorBoundary'
import IAppProps from './IAppProps'

class App extends React.Component<IAppProps> {
    constructor(props: any) {
        super(props)
        this.renderRoutes = this.renderRoutes.bind(this)
    }

    public async componentDidMount() {
        await this.props.setUserAuthenticationStatus()
        await this.props.setAppLoaded()
    }

    private handleAlertClose = () => {
        const { closeAlert } = this.props as any
        closeAlert()
    }

    private renderRoutes() {
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
                    <TransparentPaper>
                        <BrowserRouter>
                            <Switch>
                                <Route
                                    exact={true}
                                    path={VIEW_LOGOUT}
                                    component={Logout}
                                />

                                <Route
                                    exact={true}
                                    path={VIEW_ACTIVATE_ACCOUNT}
                                    component={ActivateAccount}
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
                        <Alert
                            onClose={this.handleAlertClose}
                            variant={this.props.alertType || 'error'}
                            transition="down"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            open={this.props.alertIsOpen}
                            message={this.props.alertMessage}
                        />
                    </TransparentPaper>
                </Grid>
            </Grid>
        )
    }

    public render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <ErrorBoundary>
                    <MuiThemeProvider theme={DarkTheme}>
                        {this.props.appLoaded ? (
                            this.renderRoutes()
                        ) : (
                            <AppLoading />
                        )}
                    </MuiThemeProvider>
                </ErrorBoundary>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.app)
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        Object.assign(
            {},
            {
                setAppLoaded,
                setUserAuthenticationStatus,
                closeAlert
            }
        ),
        dispatch
    )

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
export default AppContainer
