import * as React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Grid, CssBaseline, MuiThemeProvider, Snackbar, CircularProgress } from '@material-ui/core'
import { Provider } from 'react-redux'
import store from '../shared/store'
import Dashboard from '../dashboard'
import { Login, Logout }from '../auth'
import PrivateRoute from './PrivateRoute'
import EventBus from 'eventing-bus'
import ConfirmationDialog from '../shared/dialogs/ConfirmationDialog'
import { AppTheme } from './Theme'
import { VIEW_LOGIN, VIEW_LOGOUT } from '../shared/routes'

class App extends React.Component<any> {
    
    constructor(props: any) {
        super(props)
    }
    
    public state = {
        snackbarMessage: null,
        isSnackBarOpen: false,
        stateMachine: 'loading'
    }

    public componentDidMount () {
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

    private renderSnackBar = () => {
        return (
            <Snackbar
                onClose={this.onCloseSnackBar}
                message={this.state.snackbarMessage}
                open={this.state.isSnackBarOpen}
                autoHideDuration={6000}
            />
        )
    }

    private renderStateLoaded() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route path={VIEW_LOGOUT} component={Logout}/>
                        <Route path={VIEW_LOGIN} component={Login}/>
                        <PrivateRoute component={Dashboard} isLoggedIn={this.props.isLoggedIn} />
                    </Switch>
                </BrowserRouter>
                {this.renderSnackBar()}
            </React.Fragment>
        )
    }

    private renderStateError = () => (
        <ConfirmationDialog
            title="Not connected to Web3 Provider"
            onClick={null}
            open={true}
            onClose={null}
            message={
                "Looks like you aren't connected to a local node. " +
                'Please setup a local node with an open RPC port @ 8545 and try again.'
            }
        />
    )

    private renderStateLoading = () => <CircularProgress />

    private renderInner = () => {
        switch (this.state.stateMachine) {
            case 'loaded':
                return this.renderStateLoaded()

            case 'loading':
                return this.renderStateLoading()

            case 'error':
                return this.renderStateError()

            default:
                return null
        }
    }

    public render() {
        return (
            <React.Fragment>
            <CssBaseline />
            <Provider store={store}>
                <MuiThemeProvider theme={AppTheme}>
                <Grid container={true} spacing={24}>
                    <Grid item={true} xs={12} style={{ paddingLeft: '2em', paddingRight: '2em'}}>
                        {this.renderInner()}
                    </Grid>
                </Grid>
                </MuiThemeProvider>
            </Provider>
          </React.Fragment>
        )
    }
}

export default App