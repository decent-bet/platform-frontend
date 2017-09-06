/**
 * Created by user on 9/6/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'

import Helper from '../../../Helper'

const helper = new Helper()

const BigNumber = require('bignumber.js')
const constants = require('./../../../Constants')
const ethUnits = require('ethereum-units')

const styles = require('../../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15

import './slots.css'

class Slots extends Component {

    constructor(props) {
        super(props)
        this.state = {
            channels: []
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {

    }

    initWatchers = () => {
        this.watchers().newChannel()
        this.watchers().channelDeposit()
        this.watchers().channelActivate()
        this.watchers().channelFinalized()
    }

    watchers = () => {
        const self = this
        return {
            newChannel: () => {
                let newChannelEvent = helper.getContractHelper().getSlotsChannelManagerInstance().LogNewChannel({}, {
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                newChannelEvent.watch((err, event) => {
                    if (err)
                        console.log('New channel event error', err)
                    else {
                        let id = event.args.id
                        let user = event.args.user
                        let initialDeposit = event.args.initialDeposit
                        console.log('New channel event', JSON.stringify(event), id, user, initialDeposit)
                    }
                })
            },
            channelDeposit: () => {
                let depositChannelEvent = helper.getContractHelper().getSlotsChannelManagerInstance()
                    .LogChannelDeposit({}, {
                        fromBlock: 0,
                        toBlock: 'latest'
                    })
                depositChannelEvent.watch((err, event) => {
                    if (err)
                        console.log('Deposit channel event error', err)
                    else {
                        let id = event.args.id
                        let finalUserHash = event.args.finalUserHash
                        console.log('Deposit channel event', JSON.stringify(event), id, finalUserHash)
                    }
                })
            },
            channelActivate: () => {
                let activateChannelEvent = helper.getContractHelper().getSlotsChannelManagerInstance()
                    .LogChannelActivate({}, {
                        fromBlock: 0,
                        toBlock: 'latest'
                    })
                activateChannelEvent.watch((err, event) => {
                    if (err)
                        console.log('Activate channel event error', err)
                    else {
                        let id = event.args.id
                        let finalSeedHash = event.args.finalSeedHash
                        let finalReelHash = event.args.finalReelHash
                        console.log('Activate channel event', JSON.stringify(event), id, finalSeedHash, finalReelHash)
                    }
                })
            },
            channelFinalized: () => {
                let finalizedChannelEvent = helper.getContractHelper().getSlotsChannelManagerInstance()
                    .LogChannelFinalized({}, {
                        fromBlock: 0,
                        toBlock: 'latest'
                    })
                finalizedChannelEvent.watch((err, event) => {
                    if (err)
                        console.log('Finalized channel event error', err)
                    else {
                        let id = event.args.id
                        let user = event.args.user
                        console.log('Finalized channel event', JSON.stringify(event), id, user)
                    }
                })
            }
        }
    }

    web3Getters = () => {
        const self = this
        return {}
    }

    web3Setters = () => {
        const self = this
        return {}
    }

    helpers = () => {
        const self = this
        return {}
    }

    views = () => {
        const self = this
        return {
            top: () => {
                return <div className="row">
                    <div className="col">
                        <div className="top">
                            <img src={process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.png'} className="logo"/>
                            <h3 className="text-center mt-3">SLOTS</h3>
                        </div>
                    </div>
                </div>
            },
            intro: () => {
                return <div className="row">
                    <div className="col" style={{marginTop: 30}}>
                        <div className="intro">
                            <h5 className="text-center text-uppercase">Select a slot machine from the variety <span
                                className="text-gold">Decent.bet </span> offers to start a new channel</h5>
                        </div>
                    </div>
                </div>
            },
            slotMachines: () => {
                return <div className="row">
                    <div className="col" style={{marginTop: 45}}>
                        { self.views().slotsCard('Crypto Chaos', 'backgrounds/slots-crypto-chaos.png')}
                    </div>
                </div>
            },
            slotsCard: (name, imgUrl) => {
                return <div className="col-6 hvr-float">
                    <Card style={styles.card} className="mb-4">
                        <div style={{
                            background: 'url(' + process.env.PUBLIC_URL + 'assets/img/' + imgUrl + ')',
                            backgroundSize: 'cover',
                            paddingTop: 225,
                            height: 300,
                            borderRadius: styles.card.borderRadius
                        }}>

                        </div>
                    </Card>
                </div>
            },
            slotChannelsCard: () => {
                return <div className="row channels">
                    <div className="col">
                        <Card style={styles.card} className="p-4">
                            <section>
                                <h3 className="text-center text-uppercase mb-3">Open channels</h3>
                                <small className="text-white"><span
                                    className="text-gold font-weight-bold">Decent.bet </span>
                                    relies on "State Channels" to
                                    ensure casino users can enjoy lightning fast games while still being secured by
                                    smart
                                    contracts
                                    on the blockchain. Listed below are channels created from your current address
                                    which you can continue using or be closed at your will.
                                </small>
                                { self.views().slotChannels() }
                            </section>
                        </Card>
                    </div>
                </div>
            },
            slotChannels: () => {
                return <div className="row">
                    <div className="col">
                        <table className="table table-striped mt-4">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Address</th>
                                <th>Deposit</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            { self.state.channels.length > 0 &&
                            <tbody>
                            {   self.state.channels.map((channel, index) =>
                                <tr>
                                    <th scope="row">index</th>
                                    <td>{ channel.address }</td>
                                    <td>{ channel.deposit }</td>
                                    <td>{ channel.status }</td>
                                </tr>
                            )}
                            </tbody>
                            }
                        </table>
                        {   self.state.channels.length == 0 &&
                        <div className="row">
                            <div className="col">
                                <h5 className="text-center text-uppercase">No channels available yet..</h5>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {}
    }

    render() {
        const self = this
        return <div className="slots">
            <div className="container">
                { self.views().top() }
                { self.views().intro() }
                { self.views().slotMachines() }
                { self.views().slotChannelsCard() }
            </div>
        </div>
    }

}

export default Slots