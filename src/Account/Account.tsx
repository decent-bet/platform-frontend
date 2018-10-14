import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import { Grid, Paper, Stepper, StepButton, Step } from '@material-ui/core'
import AccountAddress from './AccountAddress'
import AccountInfo from './AccountInfo'
import TransparentPaper from '../common/components/TransparentPaper'

export interface IAccountState {
    activeStep: number
}

class Account extends React.Component<any, IAccountState> {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 0
        }

        this.handleStep = this.handleStep.bind(this)
    }

    private handleStep(step) {
        return () => {
            this.setState({
                activeStep: step
            })
        }
    }

    public render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                    container={true}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item={true} xs={12}>
                        <TransparentPaper>
                            <Stepper
                                alternativeLabel={true}
                                nonLinear={true}
                                style={{ backgroundColor: 'transparent' }}
                                activeStep={this.state.activeStep}
                            >
                                <Step completed={this.props.accountIsVerified}>
                                    <StepButton onClick={this.handleStep(0)}>
                                        Account info
                                    </StepButton>
                                </Step>
                                <Step completed={this.props.accountHasAddress}>
                                    <StepButton onClick={this.handleStep(1)}>
                                        Public address
                                    </StepButton>
                                </Step>
                            </Stepper>
                        </TransparentPaper>
                    </Grid>
                    <Grid item={true} xs={12} md={9}>
                        <Paper>
                            {this.state.activeStep === 0 ? (
                                <AccountInfo />
                            ) : (
                                <AccountAddress />
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.account, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const AccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
export default AccountContainer
