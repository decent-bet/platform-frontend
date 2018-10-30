import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { Grid, Paper, Stepper, StepButton, Step } from '@material-ui/core'
import AccountAddress from './Address'
import BasicAccountInfo from './BasicAccountInfo'
import TransparentPaper from '../common/components/TransparentPaper'
import { VIEW_CASINO } from '../routes'

export interface IAccountState {
    activeStep: number
    isSaving: boolean
}

class Account extends React.Component<any, IAccountState> {
    constructor(props) {
        super(props)
        this.state = {
            isSaving: false,
            activeStep: this.defaultStep
        }

        this.handleStep = this.handleStep.bind(this)
        this.saveAccountAddress = this.saveAccountAddress.bind(this)
        this.saveAccountInfo = this.saveAccountInfo.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
    }

    private get defaultStep(): number {
        if (this.props.accountHasAddress && !this.props.accountIsVerified) {
            return 1
        } else if (
            this.props.accountHasAddress &&
            this.props.accountIsVerified
        ) {
            return 0
        } else {
            return 0
        }
    }

    private onSuccess(step: number): void {
        if (step === 0) {
            this.setState({
                activeStep: 1
            })
        } else if (step === 1) {
            this.props.history.push(VIEW_CASINO)
        }
    }

    private handleStep(stepstep: number) {
        return () => {
            this.setState({
                activeStep: stepstep
            })
        }
    }

    private async saveAccountAddress(
        publicAddress: string,
        privateKey: string
    ): Promise<void> {
        try {
            this.setState({
                isSaving: true
            })
            await this.props.saveAccountAddress(
                this.props.account,
                publicAddress,
                privateKey
            )
            this.setState({
                isSaving: false
            })
            this.onSuccess(0)
        } catch {
            this.setState({
                isSaving: false
            })
        }
    }

    private async saveAccountInfo(data: any): Promise<void> {
        try {
            await this.props.saveAccountInfo(data)
            this.setState({
                isSaving: false
            })
            this.onSuccess(1)
        } catch {
            this.setState({
                isSaving: false
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
                    <Grid item={true} xs={10}>
                        <TransparentPaper>
                            <Stepper
                                nonLinear={this.props.accountHasAddress}
                                alternativeLabel={true}
                                style={{ backgroundColor: 'transparent' }}
                                activeStep={this.state.activeStep}
                            >
                                <Step completed={this.props.accountHasAddress}>
                                    <StepButton onClick={this.handleStep(0)}>
                                        VET address
                                    </StepButton>
                                </Step>
                                <Step completed={this.props.accountIsVerified}>
                                    <StepButton onClick={this.handleStep(1)}>
                                        Account info
                                    </StepButton>
                                </Step>
                            </Stepper>
                        </TransparentPaper>
                    </Grid>
                    <Grid item={true} xs={12} md={9}>
                        <Paper>
                            {this.state.activeStep === 0 ? (
                                <AccountAddress
                                    isSaving={this.state.isSaving}
                                    account={this.props.account}
                                    accountHasAddress={
                                        this.props.accountHasAddress
                                    }
                                    saveAccountAddress={this.saveAccountAddress}
                                />
                            ) : (
                                <BasicAccountInfo
                                    isSaving={this.state.isSaving}
                                    account={this.props.account}
                                    accountIsVerified={
                                        this.props.accountIsVerified
                                    }
                                    saveAccountInfo={this.saveAccountInfo}
                                />
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
