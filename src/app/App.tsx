import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Grid, CssBaseline, MuiThemeProvider, Snackbar, CircularProgress } from '@material-ui/core'
import Dashboard from '../Dashboard'
import Auth from '../Auth'
import Logout from '../Logout'
import ActivateAccount from '../ActivateAccount'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import EventBus from 'eventing-bus'
import { DarkTheme } from '../common/themes/dark'
import { VIEW_AUTH, VIEW_LOGOUT, VIEW_ACTIVATE } from '../routes'
import { userIsLoggedIn } from '../common/state/thunks'

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
        await this.props.dispatch(userIsLoggedIn())
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

    public render() {
        return (
            <React.Fragment>
            <CssBaseline />
                <MuiThemeProvider theme={DarkTheme}>
                    <Grid container={true} 
                direction="row"
                alignItems="center"
                alignContent="center"
                justify="center">
                        <Grid item={true} xs={12} style={{ paddingLeft: '2em', paddingRight: '2em'}}>
                            {this.state.stateMachine === 'loaded'? <BrowserRouter>
                                <Switch>
                                    <Route path={VIEW_LOGOUT} component={Logout}/>
                                    <Route path={VIEW_ACTIVATE} component={ActivateAccount}/>
                                    <PublicRoute path={VIEW_AUTH} component={Auth} isLoggedIn={this.props.isLoggedIn}/>
                                    <PrivateRoute exact={true} component={Dashboard} isLoggedIn={this.props.isLoggedIn} />
                                </Switch>
                            </BrowserRouter> : <CircularProgress/>}
                            <Snackbar onClose={this.onCloseSnackBar}
                                    message={this.state.snackbarMessage}
                                    open={this.state.isSnackBarOpen}
                                    autoHideDuration={6000}
                            />
                        </Grid>
                    </Grid>
                </MuiThemeProvider>
          </React.Fragment>
        )
    }
}


export default connect((state: any) => state.main)(App)