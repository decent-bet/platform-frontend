import React, { Component, ChangeEvent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from '../state/thunks'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { Grid, Paper, Tabs } from '@material-ui/core'
import TabLink from './TabLink'
import TransparentPaper from '../../common/components/TransparentPaper'
import Routes from '../../routes'
import ListAltIcon from '@material-ui/icons/ListAlt'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import IAccountProps from './IAccountProps'
import { IAccountState, DefaultState } from './AccountState'
import AccountRouter from '../AccountRouter'

class Account extends Component<IAccountProps, IAccountState> {
    public readonly state: IAccountState = DefaultState

    public componentDidMount() {
        const { pathname } = this.props.history.location
        this.setState({ activeTap: pathname })
    }

    private handleChangeTab = (_event: ChangeEvent<{}>, value: any): void => {
        this.setState({ activeTap: value })
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
            this.setState({ activeTap: Routes.AccountInfo })
            this.props.history.push(Routes.AccountInfo)
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
            this.props.history.push(Routes.Casino)
        } catch {
            this.setState({
                isSaving: false
            })
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
                                value={this.state.activeTap}
                                onChange={this.handleChangeTab}
                                centered={true}
                                fullWidth={true}
                                indicatorColor="secondary"
                                textColor="primary"
                            >
                                <TabLink
                                    value={Routes.AccountAddress}
                                    to={Routes.AccountAddress}
                                    label="VET address"
                                    icon={<VpnKeyIcon />}
                                />
                                <TabLink
                                    value={Routes.AccountInfo}
                                    to={Routes.AccountInfo}
                                    disabled={!this.props.accountHasAddress}
                                    label="Account info"
                                    icon={<AssignmentIndIcon />}
                                />
                                {this.props.accountIsVerified &&
                                this.props.accountHasAddress ? (
                                    <TabLink
                                        value={Routes.AccountTransactionHistory}
                                        to={Routes.AccountTransactionHistory}
                                        label="Transaction History"
                                        icon={<ListAltIcon />}
                                    />
                                ) : null}
                            </Tabs>
                        </TransparentPaper>
                        <Paper>
                            <AccountRouter
                                isSaving={this.state.isSaving}
                                account={this.props.account}
                                accountIsVerified={this.props.accountIsVerified}
                                saveAccountInfo={this.saveAccountInfo}
                                accountHasAddress={this.props.accountHasAddress}
                                saveAccountAddress={this.saveAccountAddress}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
        )
    }
}

const mapStateToProps = state => {
    return { ...state.account.account, ...state.main }
}

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators({ ...thunks }, dispatch)
}

const AccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
export default AccountContainer
