/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'

import Card, {CardText} from 'material-ui/Card'

import Helper from '../../Helper'

const helper = new Helper()

import './statistics.css'

class Statistics extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentSession: 0,
            houseFunds: 0,
            winnings: 0,
            profitSharePercent: 0,
            userShares: 0,
            betsPlaced: 0,
            payouts: 0,
        }
    }

    componentWillMount = () => {
        const self = this
        helper.getContractHelper().getWrappers().house().getProfitSharePercent().then((percent) => {
            console.log('House profit %: ' + percent + typeof percent)
            self.setState({
                profitSharePercent: percent.toString()
            })
        })
        helper.getContractHelper().getWrappers().house().getCurrentSession().then((session) => {
            console.log('House current session: ' + session + typeof session)
            self.setState({
                currentSession: session.toNumber()
            })
            self.getSessionStats(session)
        })

    }

    getSessionStats = () => {

    }

    render() {
        const self = this
        return <div className="statistics">
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-12">
                        <h1 style={{
                            fontSize: 20
                        }}>H O U S E&ensp;&ensp;>&ensp;&ensp;S T A T I S T I C S</h1>
                    </div>
                </div>
                <div className="row stat-row" style={{marginBottom: 50}}>
                    <div className="col col-4 hvr-grow stat-col clickable divided">
                        <div className="stat-card">
                            <img src="assets/img/icons/house/quarter.png" className="icon"/>
                            <h1 className="text-center highlight">
                                { self.state.currentSession }
                            </h1>
                            <p className="text-center">
                                S E S S I O N
                            </p>
                        </div>
                    </div>
                    <div className="col col-4 hvr-grow stat-col clickable divided">
                        <div className="stat-card">
                            <img src="assets/img/icons/house/profit-share.png" className="icon"/>
                            <h1 className="text-center highlight">
                                { self.state.profitSharePercent }%
                            </h1>
                            <p className="text-center">
                                P R O F I T<br/>S H A R E
                            </p>
                        </div>
                    </div>
                    <div className="col col-4 hvr-grow stat-col clickable">
                        <div className="stat-card">
                            <img src="assets/img/icons/house/house-funds.png" className="icon"/>
                            <h1 className="text-center highlight">
                                { self.state.houseFunds }
                                <small>&ensp;DBETs</small>
                            </h1>
                            <p className="text-center">
                                H O U S E<br/>F U N D S
                            </p>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row" style={{marginTop: 40}}>
                    <div className="col col-4 hvr-grow stat-col clickable divided">
                        <img src="assets/img/icons/house/shares.png" className="icon"/>
                        <div className="stat-card">
                            <h1 className="text-center highlight">
                                { self.state.userShares }
                            </h1>
                            <p className="text-center">
                                T O T A L<br/>S H A R E S
                            </p>
                        </div>
                    </div>
                    <div className="col col-4 hvr-grow stat-col clickable divided">
                        <img src="assets/img/icons/house/bets-placed.png" className="icon"/>
                        <div className="stat-card">
                            <h1 className="text-center highlight">
                                { self.state.betsPlaced }
                            </h1>
                            <p className="text-center">
                                B E T S<br/>P L A C E D
                            </p>
                        </div>
                    </div>
                    <div className="col col-4 hvr-grow stat-col clickable">
                        <img src="assets/img/icons/house/winnings.png" className="icon"/>
                        <div className="stat-card">
                            <h1 className="text-center highlight">
                                { self.state.winnings }
                                <small>&ensp;DBETs</small>
                            </h1>
                            <p className="text-center">
                                H O U S E<br/>W I N N I N G S
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Statistics