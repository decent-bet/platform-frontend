import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Card, Grid, CardHeader } from '@material-ui/core'
import AuthRouter from './AuthRouter'
import actions from './state/actions'
import logo from '../assets/img/dbet-white.svg'
import { withStyles, createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        root: { height: '100vh' },
        grid: {
            width: '35rem',
            height: '100%'
        },
        card: {
            paddingBottom: '1em',
            paddingTop: '1em',
            marginTop: '1em',
            boxShadow:
                '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
        }
    })

class Auth extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    public componentWillUnmount() {
        if (this.props.recaptcha && this.props.recaptcha.current) {
            this.props.recaptcha.current.reset()
        }
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
                <Grid
                    item={true}
                    xs={12}
                    sm={5}
                    md={5}
                    className={this.props.classes.grid}
                >
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
                        <AuthRouter />
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

const styledAuthComponent = withStyles(styles)(Auth)

const mapStateToProps = state => Object.assign({}, state.auth)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, actions.auth), dispatch)

const AuthContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledAuthComponent)
export default withStyles(styles)(AuthContainer)
