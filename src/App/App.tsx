import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Grid, CssBaseline, MuiThemeProvider } from '@material-ui/core'
import Main from '../Main'
import Auth from '../Auth'
import ActivateAccount from '../ActivateAccount'
import Logout from '../Logout'
import PrivacyPolicy from '../PrivacyPolicy'
import TermsAndConditions from '../TermsAndConditions'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import DarkTheme from '../common/themes/dark'
import {
    VIEW_LOGOUT,
    VIEW_MAIN,
    VIEW_AUTH,
    VIEW_ACTIVATE_ACCOUNT,
    VIEW_PRIVACY_POLICY,
    VIEW_TERMS_AND_CONDITIONS
} from '../routes'
import {
    setAppLoaded,
    getAuthenticationSubject,
    checkLogin,
    logout,
    closeAlert
} from '../common/state/thunks'
import AppLoading from '../common/components/AppLoading'
import TransparentPaper from '../common/components/TransparentPaper'
import Alert from '../common/components/Alert'
import ErrorBoundary from './ErrorBoundary'
import IAppProps from './IAppProps'
import { ReplaySubject, Subscription } from 'rxjs'

class App extends React.Component<IAppProps, any> {
    private _authSubscription$: Subscription
    private _authTimer: NodeJS.Timer

    constructor(props: any) {
        super(props)
        this.renderRoutes = this.renderRoutes.bind(this)
        this.state = { userIsAuthenticated: false }
        this.setAuthTimer = this.setAuthTimer.bind(this)
    }

    public async componentDidMount() {
        const authResult = await this.props.getAuthenticationSubject()
        const subject$ = authResult.value as ReplaySubject<any>

        this._authSubscription$ = subject$.subscribe(async isAuthenticated => {
            if (isAuthenticated) {
                this.setState({ userIsAuthenticated: true })
                if (!this._authTimer) {
                    this.setAuthTimer()
                }
            } else {
                this.setState({ userIsAuthenticated: false })
                if (this._authTimer) {
                    clearInterval(this._authTimer)
                    await this.props.logout()
                }
            }

            if (!this.props.appLoaded) {
                await this.props.setAppLoaded()
            }
        })

        await this.props.checkLogin()
    }

    public componentWillUnmount() {
        if (this._authSubscription$) {
            this._authSubscription$.unsubscribe()
        }

        if (this._authTimer) {
            clearInterval(this._authTimer)
        }
    }

    private setAuthTimer(): void {
        this._authTimer = setInterval(async () => {
            await this.props.checkLogin()
        }, 1000)
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
                <Grid item={true} xs={12}>
                    <TransparentPaper>
                        <BrowserRouter>
                            <Switch>
                                <Route
                                    exact={true}
                                    path={VIEW_PRIVACY_POLICY}
                                    component={PrivacyPolicy}
                                />
                                <Route
                                    exact={true}
                                    path={VIEW_TERMS_AND_CONDITIONS}
                                    component={TermsAndConditions}
                                />
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
                                        this.state.userIsAuthenticated
                                    }
                                />
                                <PrivateRoute
                                    path={VIEW_MAIN}
                                    component={Main}
                                    userIsAuthenticated={
                                        this.state.userIsAuthenticated
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
                getAuthenticationSubject,
                checkLogin,
                logout,
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
