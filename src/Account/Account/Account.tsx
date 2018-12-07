import React, { Component, ChangeEvent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from '../state/thunks'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { Grid, Paper, Tabs, Tab } from '@material-ui/core'
import AccountAddress from '../Address'
import BasicAccountInfo from '../BasicAccountInfo'
import TransparentPaper from '../../common/components/TransparentPaper'
import Routes from '../../routes'
import TransactionHistory from '../TransactionHistory'
import ListAltIcon from '@material-ui/icons/ListAlt'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import IAccountProps from './IAccountProps'
import { IAccountState, DefaultState } from './AccountState'

class Account extends Component<IAccountProps, IAccountState> {
    public state: Readonly<IAccountState> = DefaultState

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

    private handleChangeTab = (_event: ChangeEvent<{}>, value: any): void => {
        this.setState({
            activeStep: value
        })
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

    private saveAccountInfo = async (data: any) => {
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
                        xs={12}
                        md={9}
                        style={{
                            maxWidth: 1300
                        }}
                    >
                        <TransparentPaper>
                            <Tabs
                                value={this.state.activeStep}
                                onChange={this.handleChangeTab}
                                centered={true}
                                fullWidth={true}
                                indicatorColor="secondary"
                                textColor="primary"
                            >
                                <Tab
                                    label="VET address"
                                    icon={<VpnKeyIcon />}
                                />
                                <Tab
                                    disabled={!this.props.accountHasAddress}
                                    label="Account info"
                                    icon={<AssignmentIndIcon />}
                                />
                                {this.props.accountIsVerified &&
                                this.props.accountHasAddress ? (
                                    <Tab
                                        label="Transaction History"
                                        icon={<ListAltIcon />}
                                    />
                                ) : null}
                            </Tabs>
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

const mapStateToProps = function(state) {
    return { ...state, ...state.account, ...state.main }
}
const mapDispatchToProps = function(dispatch) {
    return bindActionCreators({ ...thunks }, dispatch)
}

const AccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
export default AccountContainer
