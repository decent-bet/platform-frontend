import React from 'react'
import { Card } from 'material-ui'
import Helper from '../../../../Helper'

const styles = require('../../../../Base/styles').styles()
const helper = new Helper()

export default function Stats({
    bettingProvider,
    onDepositTokensDialogOpen,
    onOpenWithdrawDialog
}) {
    let warning = null
    if (bettingProvider.depositedTokens === 0) {
        warning = (
            <div className="col-12 mt-4">
                <p className="text-danger text-center text-uppercase small">
                    Please deposit tokens into the sportsbook contract before
                    placing any bets
                </p>
            </div>
        )
    }
    return (
        <section>
            <Card style={styles.card} className="mt-4 p-4">
                <div className="row stats">
                    <div className="col-12 mb-4">
                        <h4 className="text-uppercase text-center">
                            Sportsbook Stats
                        </h4>
                    </div>
                    <div className="col-6">
                        <p className="key">Current Session</p>
                        <p>{bettingProvider.currentSession}</p>
                    </div>
                    <div className="col-6">
                        <p className="key text-center">Your Session Balance</p>
                        <p>{bettingProvider.depositedTokens} DBETs</p>
                        <button
                            className="btn btn-primary btn-sm mx-auto px-2"
                            onClick={onDepositTokensDialogOpen}
                        >
                            Deposit
                        </button>
                        <button
                            className="btn btn-primary btn-sm mx-auto mt-2"
                            onClick={onOpenWithdrawDialog}
                        >
                            Withdraw
                        </button>
                    </div>
                    <div className="col-6">
                        <p className="key">Sportsbook balance</p>
                        <p>{helper.commafy(bettingProvider.balance)} DBETs</p>
                    </div>
                    {warning}
                </div>
            </Card>
        </section>
    )
}
