import React from 'react'
import { Card } from 'material-ui'
import SlotChannelListItem from './SlotChannelListItem'

const constants = require('./../../../Constants')
const styles = require('../../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15
styles.button = {
    fontSize: 12,
    marginTop: 12.5,
    marginRight: 10,
    fontFamily: 'Lato',
    color: constants.COLOR_WHITE
}

export default function SlotChannelList({
    stateChannels,
    onDepositToChannelListener,
    onWithdrawChipsListener,
    onGetChipsListener,
    chipsLabel
}) {
    return (
        <div className="row channels">
            <div className="col-12">
                {/** Slots chips are merely DBETs that're deposited into the Slots Channel Manager contract
                 and can be withdrawn at any time*/}
                <button
                    className="btn btn-sm btn-primary hvr-fade float-right"
                    style={styles.button}
                >
                    Slots chips:
                    <span className="ml-1">{chipsLabel}</span>
                </button>
                <button
                    className="btn btn-sm btn-primary hvr-fade float-right text"
                    style={styles.button}
                    onClick={onWithdrawChipsListener}
                >
                    Withdraw Chips
                </button>
                <button
                    className="btn btn-sm btn-primary hvr-fade float-right text"
                    style={styles.button}
                    onClick={onGetChipsListener}
                >
                    Get slots chips
                </button>
            </div>
            <div className="col-12 mt-4">
                <Card style={styles.card} className="p-4">
                    <section>
                        <h3 className="text-center text-uppercase mb-3">
                            Open channels
                        </h3>
                        <small className="text-white">
                            <span className="text-gold font-weight-bold">
                                Decent.bet{' '}
                            </span>
                            relies on "State Channels" to ensure casino users
                            can enjoy lightning fast games while still being
                            secured by smart contracts on the blockchain. Listed
                            below are channels created from your current address
                            which can be continued or closed at any point in
                            time.
                        </small>
                        <div className="row">
                            <div className="col">
                                <table className="table table-striped mt-4">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Deposit</th>
                                            <th>Status</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    {Object.keys(stateChannels).length > 0 && (
                                        <tbody>
                                            {Object.keys(stateChannels).map(
                                                id => {
                                                    if (
                                                        stateChannels.hasOwnProperty(
                                                            id
                                                        )
                                                    ) {
                                                        let channel =
                                                            stateChannels[id]
                                                        return (
                                                            <SlotChannelListItem
                                                                key={id}
                                                                id={id}
                                                                stateChannel={
                                                                    channel
                                                                }
                                                                onDepositToChannelListener={
                                                                    onDepositToChannelListener
                                                                }
                                                            />
                                                        )
                                                    } else {
                                                        return <span />
                                                    }
                                                }
                                            )}
                                        </tbody>
                                    )}
                                </table>
                                {Object.keys(stateChannels).length == 0 && (
                                    <div className="row">
                                        <div className="col">
                                            <h5 className="text-center text-uppercase">
                                                No channels available yet..
                                            </h5>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </Card>
            </div>
        </div>
    )
}
