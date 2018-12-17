import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import AccountAddress from './AccountAddress'
import BasicAccountInfo from './BasicAccountInfo'
import TransactionHistory from './TransactionHistory'
import Routes from '../routes'

export interface IAccountRouterProps {
    isSaving: boolean
    accountIsVerified: boolean
    account: any
    accountHasAddress: boolean
    saveAccountAddress(account: any, publicAddress: string, privateKey: string)
    saveAccountInfo(data: any)
}

const AccountRouter: FunctionComponent<IAccountRouterProps> = ({
    isSaving,
    account,
    accountIsVerified,
    saveAccountInfo,
    accountHasAddress,
    saveAccountAddress
}) => {
    const accountAddress = props => (
        <AccountAddress
            {...props}
            isSaving={isSaving}
            account={account}
            accountHasAddress={accountHasAddress}
            saveAccountAddress={saveAccountAddress}
        />
    )

    const basicAccountInfo = props =>
        accountHasAddress ? (
            <BasicAccountInfo
                {...props}
                isSaving={isSaving}
                account={account}
                accountIsVerified={accountIsVerified}
                saveAccountInfo={saveAccountInfo}
            />
        ) : (
            <Redirect to={Routes.AccountAddress} />
        )

    const transactionHistory = props => {
        if (accountIsVerified && accountHasAddress) {
            const address = account.verification.addressRegistration.vetAddress
            return (
                <TransactionHistory
                    {...props}
                    isSaving={isSaving}
                    vetAddress={address}
                />
            )
        } else {
            return <Redirect to={Routes.AccountAddress} />
        }
    }

    return (
        <Switch>
            <Redirect
                exact={true}
                from={Routes.Account}
                to={Routes.AccountAddress}
            />

            <Route path={Routes.AccountAddress} render={accountAddress} />
            <Route path={Routes.AccountInfo} render={basicAccountInfo} />
            {accountIsVerified && accountHasAddress ? (
                <Route
                    path={Routes.AccountTransactionHistory}
                    render={transactionHistory}
                />
            ) : null}
        </Switch>
    )
}

export default AccountRouter
