import React, {Component} from 'react'

import {Card} from 'material-ui'

import Helper from '../../Helper'

const helper = new Helper()

const BigNumber = require('bignumber.js')
const constants = require('./../../Constants')
const ethUnits = require('ethereum-units')

const styles = require('../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15

import './casino.css'

class Casino extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount = () => {

    }

    watchers = () => {
        const self = this
        return {}
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
                            <h3 className="text-center mt-3">CASINO</h3>
                        </div>
                    </div>
                </div>
            },
            intro: () => {
                return <div className="row">
                    <div className="col" style={{marginTop: 30}}>
                        <div className="intro">
                            <h5 className="text-center text-uppercase">Choose from a variety of Casino games available
                                on
                                the <span className="text-gold">Decent.bet </span>
                                platform</h5>
                        </div>
                    </div>
                </div>
            },
            games: () => {
                return <div className="row">
                    <div className="col" style={{marginTop: 60, marginBottom: 60}}>
                        <div className="games">
                            <div className="row">
                                { self.views().gameCard('Slots', 'backgrounds/slots.jpg', '/slots', true)}
                                { self.views().gameCard('Craps', 'backgrounds/craps.jpg', '#')}
                                { self.views().gameCard('Roulette', 'backgrounds/roulette.jpg', '#')}
                                { self.views().gameCard('Crypto price betting', 'backgrounds/crypto-price-betting.jpg', '#')}
                            </div>
                        </div>
                    </div>
                </div>
            },
            gameCard: (title, imgUrl, url, available) => {
                return <div className="col-6 hvr-float game-card">
                    <a href={url}>
                        <Card style={styles.card} className="mb-4">
                            <div style={{
                                background: ((available ? '' : 'linear-gradient(' +
                                    'rgba(0, 0, 0, 0.6),' +
                                    'rgba(0, 0, 0, 0.6)' +
                                    '), ') +
                                'url(' + process.env.PUBLIC_URL + 'assets/img/' + imgUrl + ')'),
                                backgroundSize: 'cover',
                                paddingTop: 200,
                                height: 300,
                                borderRadius: styles.card.borderRadius
                            }}>
                                <div className="title">
                                    <h4 className="mb-0">{title}</h4>
                                    {   !available &&
                                    <p className="mb-0 text-danger">AVAILABLE SOON</p>
                                    }
                                    {   available &&
                                    <p className="mb-0 text-success">AVAILABLE NOW</p>
                                    }
                                </div>
                            </div>
                        </Card>
                    </a>
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
        return <div className="casino">
            <div className="container">
                { self.views().top() }
                { self.views().intro() }
                { self.views().games() }
            </div>
        </div>
    }

}

export default Casino