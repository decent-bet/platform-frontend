import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from '../state/thunks'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { Grid, Paper, Stepper, StepButton, Step } from '@material-ui/core'
import AccountAddress from '../Address'
import BasicAccountInfo from '../BasicAccountInfo'
import TransparentPaper from '../../common/components/TransparentPaper'
import Routes from '../../routes'
import TransactionHistory from '../TransactionHistory'
import ListAltIcon from '@material-ui/icons/ListAlt'
import IAccountProps from './IAccountProps'
import AccountState from './AccountState'
import IAccountState from './IAccountState'

class Account extends React.Component<IAccountProps, IAccountState> {
    constructor(props: IAccountProps) {
        super(props)
        this.state = new AccountState()
    }

    public componentDidMount() {
        const activeStep = this.defaultStep
        this.setState({ activeStep })
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

    private onSuccess = (step: number): void => {
        if (step === 0) {
            this.setState({
                activeStep: 1
            })
        } else if (step === 1) {
            this.props.history.push(Routes.Casino)
        }
    }

    private handleStep = (stepstep: number) => {
        return () => {
            this.setState({
                activeStep: stepstep
            })
        }
    }

    private saveAccountAddress = async (
        publicAddress: string,
        privateKey: string
    ): Promise<void> => {
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

    private saveAccountInfo = async (data: any): Promise<void> => {
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

    private loadTransactions = async () => {
        return await this.props.getTransactionHistory(
            this.props.account.verification.addressRegistration.vetAddress
        )
    }

    private getActiveStepComponent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <AccountAddress
                        isSaving={this.state.isSaving}
                        account={this.props.account}
                        accountHasAddress={this.props.accountHasAddress}
                        saveAccountAddress={this.saveAccountAddress}
                    />
                )
            case 1:
                return (
                    <BasicAccountInfo
                        isSaving={this.state.isSaving}
                        account={this.props.account}
                        accountIsVerified={this.props.accountIsVerified}
                        saveAccountInfo={this.saveAccountInfo}
                    />
                )
            default:
                return (
                    <TransactionHistory
                        loading={this.props.loading}
                        transactions={this.props.transactions}
                        loadTransactions={this.loadTransactions}
                    />
                )
        }
    }

    public render() {
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Grid
                    container={true}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid
                        item={true}
                        xs={10}
                        style={{
                            maxWidth: 1300
                        }}
                    >
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
                                {this.props.accountIsVerified &&
                                this.props.accountHasAddress ? (
                                    <Step
                                        completed={
                                            this.props.accountHasAddress &&
                                            this.props.accountIsVerified
                                        }
                                    >
                                        <StepButton
                                            onClick={this.handleStep(2)}
                                            icon={
                                                <ListAltIcon color="primary" />
                                            }
                                        >
                                            Transaction History
                                        </StepButton>
                                    </Step>
                                ) : null}
                            </Stepper>
                        </TransparentPaper>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        md={9}
                        style={{
                            maxWidth: 1300
                        }}
                    >
                        <Paper>
                            {this.getActiveStepComponent(this.state.activeStep)}
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
