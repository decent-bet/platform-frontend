/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'

import moment from 'moment'

import Card from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import Helper from './../../Helper'

const helper = new Helper()

import './share-exchange.css'

const constants = require('./../../Constants')

const TYPE_BID = 'bid', TYPE_ASK = 'ask', TYPE_TRADES = 'trades', TYPE_ACTIVE_ORDERS = 'activeOrders'
const ORDER_TYPE_BUY = 'buy', ORDER_TYPE_SELL = 'sell'

const styles = {
    errorStyle: {
        color: constants.COLOR_RED
    },
    underlineStyle: {
        borderColor: constants.COLOR_PRIMARY_LIGHT
    },
    floatingLabelStyle: {
        color: constants.COLOR_PRIMARY_LIGHT
    },
    floatingLabelFocusStyle: {
        color: constants.COLOR_PRIMARY_LIGHT
    }
};

class ShareExchange extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bid: {
                amount: '',
                price: ''
            },
            ask: {
                amount: '',
                price: ''
            }
        }
    }

    componentWillMount = () => {

    }

    getBids = () => {
        return [
            this.getOrder(1.05, 100),
            this.getOrder(1.04, 999),
            this.getOrder(1.035, 5000),
            this.getOrder(1.03, 200),
            this.getOrder(1.029, 300),
        ]
    }

    getAsks = () => {
        return [
            this.getOrder(1.06, 250),
            this.getOrder(1.07, 300),
            this.getOrder(1.085, 450),
            this.getOrder(1.095, 1111),
            this.getOrder(1.099, 700)
        ]
    }

    getOrder = (price, amount) => {
        return {
            price: price,
            amount: amount
        }
    }

    getOrderItem = (order) => {
        return <tr>
            <td>{ order.price }</td>
            <td>{ order.amount }</td>
        </tr>
    }

    getActiveOrders = () => {
        let timestamp = helper.getTimestamp()
        let second = 1
        let minute = 60 * second
        return [
            this.getActiveOrder(ORDER_TYPE_BUY, 1.054, 199, timestamp - (5 * minute)),
            this.getActiveOrder(ORDER_TYPE_SELL, 1.1, 150, timestamp - (15 * minute))
        ]
    }

    getActiveOrder = (type, price, amount, timestamp) => {
        return {
            type: type,
            price: price,
            amount: amount,
            timestamp: timestamp
        }
    }

    getActiveOrderItem = (activeOrder) => {
        let time = moment.unix(activeOrder.timestamp)
        return <tr>
            <td><span className={activeOrder.type}>
                { activeOrder.type == ORDER_TYPE_BUY ? 'B U Y' : 'S E L L' }</span>
            </td>
            <td>{ activeOrder.price }</td>
            <td>{ activeOrder.amount }</td>
            <td>{ time.format('h:mm:ss A, MMMM Do') }</td>
            <td>
                <button className="btn btn-sm btn-primary cancel">C A N C E L</button>
            </td>
        </tr>
    }

    getTrades = () => {
        let timestamp = helper.getTimestamp()
        let second = 1
        let minute = 60 * second
        return [
            this.getTrade(1.059, 2000, timestamp - second),
            this.getTrade(1.0575, 125, timestamp - (minute)),
            this.getTrade(1.057, 225, timestamp - (2 * minute)),
            this.getTrade(1.052, 325, timestamp - (4 * minute)),
            this.getTrade(1.0525, 400, timestamp - (5 * minute)),
        ]
    }

    getTrade = (price, amount, timestamp) => {
        return {
            price: price,
            amount: amount,
            timestamp: timestamp
        }
    }

    getTradeItem = (trade) => {
        let time = moment.unix(trade.timestamp)
        return <tr>
            <td>{ trade.price }</td>
            <td>{ trade.amount }</td>
            <td>{ time.format('h:mm:ss A, MMMM Do') }</td>
        </tr>
    }

    getTotalAmount = (type) => {
        let orders = type == TYPE_TRADES ? this.getTrades() : (type == TYPE_BID ? this.getBids() : this.getAsks())
        let amount = 0
        orders.forEach((order) => {
            amount += order.amount
        })
        return amount
    }

    render() {
        const self = this
        return <div className="share-exchange">
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-12">
                        <h1 style={{
                            fontSize: 20
                        }}>H O U S E&ensp;&ensp;>&ensp;&ensp;S H A R E&ensp;&ensp;E X C H A N G E</h1>
                    </div>
                </div>  
                <div className="row pt-4" style={{marginTop: 30}}>
                    <div className="col col-6">
                        <Card zDepth={2} style={{borderRadius: 10}}>
                            <div style={{padding: 30, fontFamily: 'Lato'}}>
                                <h1 className="text-center">B U Y</h1>
                                <TextField
                                    value={ self.state.bid.amount }
                                    type="number"
                                    style={{marginLeft: 45, width: 300}}
                                    floatingLabelText="Amount"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    onChange={ (event, value) => {
                                        let bid = self.state.bid
                                        bid.amount = value
                                        self.setState({
                                            bid: value
                                        })
                                    }}
                                />
                                <TextField
                                    value={ self.state.bid.amount }
                                    type="number"
                                    style={{marginLeft: 45, width: 300}}
                                    floatingLabelText="Price"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    onChange={ (event, value) => {
                                        let bid = self.state.bid
                                        bid.price = value
                                        self.setState({
                                            bid: value
                                        })
                                    }}
                                />
                                <p className="text-center mt-3">Balance: 0 DBETs</p>
                                <div className="text-center mt-4 mb-4">
                                    <button className="btn btn-primary mx-auto hvr-float">B U Y&ensp;S H A R E S
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col col-6">
                        <Card zDepth={2} style={{borderRadius: 10}}>
                            <div style={{padding: 30, fontFamily: 'Lato'}}>
                                <h1 className="text-center">S E L L</h1>
                                <TextField
                                    value={ self.state.ask.amount }
                                    type="number"
                                    onChange={ (event, value) => {
                                        let ask = self.state.ask
                                        ask.amount = value
                                        self.setState({
                                            ask: value
                                        })
                                    }}
                                    style={{marginLeft: 45, width: 300}}
                                    floatingLabelText="Amount"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                />
                                <TextField
                                    value={ self.state.ask.amount }
                                    type="number"
                                    onChange={ (event, value) => {
                                        let ask = self.state.ask
                                        ask.price = value
                                        self.setState({
                                            ask: value
                                        })
                                    }}
                                    style={{marginLeft: 45, width: 300}}
                                    floatingLabelText="Price"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                />
                                <p className="text-center mt-3">Balance: 100 Shares</p>
                                <div className="text-center mt-4 mb-4">
                                    <button className="btn btn-primary mx-auto hvr-float">S E L L&ensp;S H A R E S
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="row" style={{marginTop: 40}}>
                    <div className="col col-6">
                        <Card zDepth={2} style={{borderRadius: 10}}>
                            <div style={{padding: 30, fontFamily: 'Lato'}}>
                                <h1 className="text-center">A S K S</h1>
                                <p className="text-right clickable amount mr-1">
                                    Total: { self.getTotalAmount(TYPE_ASK) } Shares
                                </p>
                                <table className="table table-hover mt-2">
                                    <thead>
                                    <tr>
                                        <th>P R I C E</th>
                                        <th>S H A R E S</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {   self.getAsks().map((ask) => {
                                            return self.getOrderItem(ask)
                                        }
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                    <div className="col col-6">
                        <Card zDepth={2} style={{borderRadius: 10}}>
                            <div style={{padding: 30, fontFamily: 'Lato'}}>
                                <h1 className="text-center">B I D S</h1>
                                <p className="text-right clickable amount mr-1">
                                    Total: { self.getTotalAmount(TYPE_BID) } Shares</p>
                                <table className="table table-hover mt-2">
                                    <thead>
                                    <tr>
                                        <th>P R I C E</th>
                                        <th>S H A R E S</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {   self.getBids().map((bid) => {
                                            return self.getOrderItem(bid)
                                        }
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="row" style={{marginTop: 40, marginBottom: 40}}>
                    <div className="col col-12">
                        <Card zDepth={2} style={{borderRadius: 10}}>
                            <div style={{padding: 30, fontFamily: 'Lato'}}>
                                <h1 className="text-center">A C T I V E&ensp;O R D E R S</h1>
                                <p className="text-right clickable amount">
                                    Total: { self.getTotalAmount(TYPE_ACTIVE_ORDERS) } Shares
                                </p>
                                <table className="table table-hover mt-2">
                                    <thead>
                                    <tr>
                                        <th>T Y P E</th>
                                        <th>P R I C E</th>
                                        <th>S H A R E S</th>
                                        <th>T I M E</th>
                                        <th>A C T I O N S</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {   self.getActiveOrders().map((activeOrder) => {
                                            return self.getActiveOrderItem(activeOrder)
                                        }
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
                {/*<hr style={{marginBottom: 40}}/>*/}
                <div className="row" style={{marginTop: 40, marginBottom: 40}}>
                    <div className="col col-12">
                        <Card zDepth={2} style={{borderRadius: 10}}>
                            <div style={{padding: 30, fontFamily: 'Lato'}}>
                                <h1 className="text-center">T R A D E S</h1>
                                <p className="text-right clickable amount">
                                    Total: { self.getTotalAmount(TYPE_TRADES) } Shares
                                </p>
                                <table className="table table-hover mt-2">
                                    <thead>
                                    <tr>
                                        <th>P R I C E</th>
                                        <th>S H A R E S</th>
                                        <th>T I M E</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {   self.getTrades().map((trade) => {
                                            return self.getTradeItem(trade)
                                        }
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default ShareExchange