import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import AccountAddress from './AccountAddress'
import BasicAccountInfo from './BasicAccountInfo'
import TransactionHistory from './TransactionHistory'
import Routes from '../routes'

const AccountRouter: FunctionComponent<any> = ({
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
                    component={TransactionHistory}
                />
            ) : null}
        </Switch>
    )
}

export default AccountRouter
