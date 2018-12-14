import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Paper
} from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'
import LoadingButton from '../common/components/LoadingButton'

class AccountNotActivated extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }

        this.requestActivationEmail = this.requestActivationEmail.bind(this)
    }

    private async requestActivationEmail(event: React.MouseEvent) {
        event.preventDefault()
        this.setState({ loading: true })
        await this.props.requestActivationEmail()
        this.setState({ loading: false })
    }

    public render() {
        return (
            <Grid
                container={true}
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid
                    item={true}
                    xs={12}
                    md={9}
                    style={{
                        maxWidth: 1300
                    }}
                >
                    <Paper>
                        <Card>
                            <CardHeader
                                title="Your account is not activated"
                                subheader={
                                    <Typography color="primary">
                                        *Please activate your account, you need
                                        an active account before continuing.
                                    </Typography>
                                }
                            />
                            <CardContent>
                                <Grid
                                    container={true}
                                    spacing={32}
                                    direction="row"
                                >
                                    <Grid item={true} xs={12} sm={12}>
                                        <Typography
                                            variant="subtitle1"
                                            component="div"
                                        >
                                            Please check your email or request a
                                            new activation email:
                                            {'   '}
                                            <LoadingButton
                                                disabled={this.state.loading}
                                                onClick={
                                                    this.requestActivationEmail
                                                }
                                                isLoading={this.state.loading}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                            >
                                                <MailIcon />
                                            </LoadingButton>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Paper>{' '}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    const { account } = state.account
    return { ...account, ...state.main }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const AccountNotActivatedContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountNotActivated)
export default AccountNotActivatedContainer
