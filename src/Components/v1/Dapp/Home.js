import React, {Component} from 'react'
import $ from 'jquery'

import AppBar from 'material-ui/AppBar';
import Card, {CardMedia, CardTitle} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import Themes from '../Base/Themes'
import ContractHelper from '../ContractHelper'
import Helper from '../Helper'

import '../../../css/oswald.css'
import '../../../css/open-sans.css'
import '../../../css/pure-min.css'

const constants = require('./../Constants')

const themes = new Themes()
const contractHelper = new ContractHelper()
const helper = new Helper()

const styles = {
    underlineStyle: {
        borderColor: constants.COLOR_PRIMARY,
    },
    floatingLabelStyle: {
        color: constants.COLOR_PRIMARY
    },
    checkbox: {
        color: constants.COLOR_PRIMARY,
        width: '100%'
    },
    checkboxIcon: {
        fill: constants.COLOR_PRIMARY
    },
    featured: {
        borderRadius: 10,
        minHeight: 350,
        marginTop: 10,
        cursor: 'pointer'
    },
    event: {
        borderRadius: 10,
        minHeight: 225,
        marginTop: 10,
        cursor: 'pointer',
        fontFamily: 'Lato'
    },
    user: {
        borderRadius: 5,
        minHeight: 350,
        cursor: 'pointer'
    }
}

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
    }

    getUpcomingEvents = () => {
        let events = []
        events.push({
            league: 'Premier League',
            name: 'Arsenal vs Everton',
            imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Emirates_Stadium_-_East_stand_Club_Level.jpg/1000px-Emirates_Stadium_-_East_stand_Club_Level.jpg'
        })
        events.push({
            league: 'NFL',
            name: 'Chiefs vs Patriots',
            imgUrl: 'http://articles.wingwire.com/wp-content/uploads/sites/12/2015/09/NFL-stadium_patriots.jpg'
        })
        events.push({
            league: 'NHL',
            name: 'Predators vs Ducks',
            imgUrl: 'https://a.vsstatic.com/mobile/app/nhl/stadium-series.jpg'
        })
        events.push({
            league: 'UFC',
            name: 'Aldo vs Holloway',
            imgUrl: 'http://cdn.mmaweekly.com/wp-content/uploads/2017/03/UFC-212-poster.png'
        })
        return events
    }

    getPremierLeagueGames = () => {
        let games = []
        games.push({
            home: 'Arsenal',
            away: 'Everton',
            time: '19:00 PM'
        })
        games.push({
            home: 'Man City',
            away: 'Middlesbrough',
            time: '19:00 PM'
        })
        return games
    }

    render() {
        const self = this
        return (
            <div>
                <div className="container-fluid">
                    <div className="row mt-2">
                        <div className="col-12">
                            <h1 style={{
                                fontSize: 20
                            }}>F E A T U R E D</h1>
                        </div>
                        <div className="col">
                            <Card style={styles.featured} zDepth={2}>
                                <div>
                                    <img
                                        src="https://static1.squarespace.com/static/559f277ee4b093ce9f2c4adb/t/59420de6cd0f68f4fdc69fab/1497501159073/newmaymac.jpg?format=750w"
                                        style={{
                                            objectFit: 'contain',
                                            height: 350,
                                            width: '100%',
                                            background: '#000000'
                                        }}/>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <h1 style={{
                                fontSize: 20
                            }}>U P C O M I N G&ensp;&ensp;E V E N T S</h1>
                        </div>
                        {   self.getUpcomingEvents().map((event) =>
                            <div className="col-3 hvr-float event-card">
                                <Card style={styles.event} zDepth={2}>
                                    <CardMedia
                                        overlayContentStyle={{
                                            background: 'rgba(0,0,0,0.75)',
                                            paddingTop: 0
                                        }}
                                        overlay={<CardTitle title={event.name}
                                                            subtitle={event.league}
                                                            titleStyle={{fontSize: 18}}
                                        />}
                                    >
                                        <img
                                            src={event.imgUrl}/>
                                    </CardMedia>
                                </Card>
                            </div>
                        )}
                    </div>
                    <hr style={{marginTop: 45, marginBottom: 20}}/>
                    <div className="row mt-4 games">
                        <div className="col-12">
                            <h1 style={{
                                fontSize: 20
                            }}>E N G L I S H&ensp;&ensp;P R E M I E R&ensp;&ensp;L E A G U E</h1>
                        </div>
                        <div className="col col-12 mt-4">
                            <Card zDepth={2} style={{borderRadius: 5}}>
                                <div>
                                    {   self.getPremierLeagueGames().map((game) =>
                                        <div style={{
                                            height: 50,
                                            paddingTop: 12,
                                            borderBottom: '1px solid rgba(0,0,0,0.15)',
                                            fontFamily: 'Lato',
                                            cursor: 'pointer'
                                        }} className="game">
                                            <div className="row">
                                                <div className="offset-1 col-4">
                                                    {game.home}
                                                </div>
                                                <div className="col-5">
                                                    {game.away}
                                                </div>
                                                <div className="col-2">
                                                    {game.time}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home
