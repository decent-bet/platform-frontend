import * as React from 'react'
import { connect } from 'react-redux'
import {
    Card,
    Grid,
    CardHeader
} from '@material-ui/core'
import AuthRouter from './AuthRouter'
import { closeAlert } from './state/thunks'
import Alert from '../common/components/Alert'
import { AlertVariant } from '../common/components/Alert/Alert'
import logo from '../assets/img/dbet-white.svg'
import { WithStyles, withStyles, createStyles } from '@material-ui/core'

const styles = () => createStyles({
    root: { height: '100vh' },
    grid: { 
        width: '35rem', 
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)' 
    },
    card: {
        paddingBottom: '1em',
        paddingTop: '1em'
    }
})

interface IAuthProps extends WithStyles<typeof styles> { 
    alertIsOpen: boolean,
    alertType: AlertVariant,
    errorMessage: string
    dispatch: (any) => void
}

class Auth extends React.Component<IAuthProps> {

    constructor(props: IAuthProps) {
        super(props)
    }

    private handleAlertClose = ()=> {
        this.props.dispatch(closeAlert())
    }
    
    public render() {
        return (
            <Grid
                container={true}
                className={this.props.classes.root}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item={true} xs={11} sm={5} md={5} className={this.props.classes.grid}>
                    <Card className={this.props.classes.card}>
                        <CardHeader
                            avatar={
                                <img
                                    src={logo}
                                    alt="Decent.bet Logo"
                                    style={{ maxHeight: 26 }}
                                />
                            }
                        />

                        <Alert
                            onClose={this.handleAlertClose}
                            variant={this.props.alertType || 'error'}
                            transition="down"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={this.props.alertIsOpen}
                            message={this.props.errorMessage}
                        />
                        <AuthRouter />
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

// Connect this component to Redux
export default withStyles(styles)(connect((state: any) => state.auth)(Auth))
