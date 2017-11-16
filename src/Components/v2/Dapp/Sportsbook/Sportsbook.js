/**
 * Created by user on 11/16/2017.
 */

import React, {Component} from 'react'
import {Card, Tab, Tabs} from 'material-ui'

import './sportsbook.css'

class Sportsbook extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offerings: [
                {
                    imgUrl: 'craps.png',
                    name: 'Craps'
                },
                {
                    imgUrl: 'sportsbook.png',
                    name: 'Sportsbook'
                },
                {
                    imgUrl: 'roulette.png',
                    name: 'Roulette'
                },
                {
                    imgUrl: 'blackjack.png',
                    name: 'Blackjack'
                },
                {
                    imgUrl: 'slots.png',
                    name: 'Slots'
                }
            ]
        }
    }

    componentWillMount = () => {

    }

    views = () => {
        const self = this
        return {
            navbar: () => {
                return <nav className="navbar navbar-toggleable-md">
                    <button className="navbar-toggler navbar-toggler-right" type="button"
                            data-toggle="collapse" data-target="#navbar-toggler"
                            aria-controls="navbar-toggler" aria-expanded="false">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto mt-2 mt-md-0">
                            <div className="container">
                                <div className="row">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="#">Discover</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Sportsbetting</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Slots</a>
                                    </li>
                                </div>
                            </div>
                        </ul>
                    </div>
                </nav>
            },
            tabs: () => {
                return <Tabs
                    className="tabs"
                    inkBarStyle={{background: '#f2b45c'}}
                    tabItemContainerStyle={{
                        height: 60,
                        background: 'rgba(0,0,0,0)',
                        borderBottom: 'solid 1px'
                    }}>
                    <Tab
                        label={<p className="mb-0">
                            <span className="fa fa-heart icon mr-2"/> Favorites
                        </p>}
                        buttonStyle={{
                            color: '#FEFEFE'
                        }}/>
                    <Tab
                        label={<p className="mb-0">
                            <span className="fa fa-id-badge icon mr-2"/> New
                        </p>}
                        buttonStyle={{
                            color: '#FEFEFE'
                        }}/>
                    <Tab
                        label={<p className="mb-0">
                            <span className="fa fa-star icon mr-2"/> Killer Games
                        </p>}
                        buttonStyle={{
                            color: '#FEFEFE'
                        }}/>
                </Tabs>
            },
            offering: (_offering, index) => {
                return <div
                    className={"col offering " + (index != (self.state.offerings.length - 1) ? "pr-1" : "pr-2")}>
                    <Card
                        style={{
                            borderRadius: 8,
                            height: 115,
                            background: 'url(' + process.env.PUBLIC_URL + '/assets/img/offerings/' + _offering.imgUrl + ')',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'none'
                        }}
                        className="clickable">
                        <div className="row">
                        </div>
                    </Card>
                    <p className="mt-3 ml-2">{_offering.name}<span className="ml-3 icon fa fa-caret-right"/></p>
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="sportsbook">
                {self.views().navbar()}
                <div className="container home">
                    <div className="row">
                        <div className="col-12 cover">
                            <img src={process.env.PUBLIC_URL + '/assets/img/backgrounds/sportsbook-main.png'}/>
                        </div>
                        <div className="col-6 py-2 pl-3 pr-0">
                            {self.views().tabs()}
                        </div>
                        <div className="col-6 py-2 pl-0 pr-3">

                            <div style={{
                                height: 60,
                                borderBottom: 'solid 1px'
                            }}>
                                <p className="text-right text-uppercase clickable" style={{
                                    fontSize: 14,
                                    paddingTop: 18
                                }}>
                                    Favorite Slots <span className="fa fa-caret-right icon ml-1 mr-2"/>
                                </p>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="container mt-3">
                                <div className="row">
                                    { self.state.offerings.map((_offering, index) =>
                                        self.views().offering(_offering, index)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}

export default Sportsbook