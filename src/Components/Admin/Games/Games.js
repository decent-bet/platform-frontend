/**
 * Created by user on 5/28/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import TimePicker from 'material-ui/TimePicker';

import ContractHelper from '../../ContractHelper'
import Helper from '../../Helper'

const contractHelper = new ContractHelper()
const helper = new Helper()

const constants = require('./../../Constants')

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
}

import './games.css'

class Games extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newGame: {
                id: '',
                parties: [],
                odds: [],
                maxBet: '',
                startTime: '',
                endTime: ''
            }
        }
    }

    addGame = () => {
        console.log('Adding game - ' + this.state.newGame.id)
        if (this.isValidGame()) {
            let newGame = this.state.newGame
            let parties = []
            let odds = []
            for (let i = 0; i < newGame.parties.length; i++) {
                parties.push(parseInt(newGame.parties[i]))
                odds.push(parseInt(newGame.odds[i]))
            }
            let startTime = Math.round(newGame.startTime.getTime() / 1000)
            let endTime = Math.round(newGame.endTime.getTime() / 1000)
            contractHelper.getWrappers().sportsBetting().addGame(
                newGame.id, newGame.parties, newGame.odds,
                newGame.maxBet, startTime, endTime).then((okay) => {
                console.log('Added game: ' + JSON.stringify(okay))
            }).catch((err) => {
                console.log('Error adding game: ' + JSON.stringify(err))
            })
        }
    }

    isValidGame = () => {
        let valid = true
        let newGame = this.state.newGame
        if (newGame.id.length == 0)
            valid = false
        if (newGame.parties.length == 0 || newGame.odds.length == 0)
            valid = false
        for (let i = 0; i < newGame.parties.length; i++) {
            if (newGame.parties[i] == '' || newGame.odds[i] == '')
                valid = false
        }
        if (newGame.maxBet == '' || newGame.startTime == '' || newGame.endTime == '')
            valid = false
        return valid
    }

    addParty = () => {
        let newGame = this.state.newGame
        newGame.parties.push('')
        newGame.odds.push('')
        this.setState({
            newGame: newGame
        })
    }

    getPartyItem = (party, index) => {
        const self = this
        let odds = this.state.newGame.odds
        return <div className="row">
            <div className="col col-12">
                <p>{helper.formatHeading('Party #' + index)}</p>
                <TextField
                    value={ party }
                    style={{width: 300}}
                    floatingLabelText="Party Index"
                    type="number"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineFocusStyle={styles.underlineStyle}
                    onChange={ (event, value) => {
                        let newGame = self.state.newGame
                        newGame.parties[index] = value
                        self.setState({
                            newGame: newGame
                        })
                    }}
                />
                <TextField
                    value={ odds[index] }
                    style={{width: 300}}
                    floatingLabelText="Odds"
                    type="number"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    underlineFocusStyle={styles.underlineStyle}
                    onChange={ (event, value) => {
                        let newGame = self.state.newGame
                        newGame.odds[index] = value
                        self.setState({
                            newGame: newGame
                        })
                    }}
                />
                <button className="btn btn-primary add-address mt-2 float-right"
                        onClick={() => {
                            let newGame = self.state.newGame
                            newGame.parties.splice(index, 1)
                            newGame.odds.splice(index, 1)
                            self.setState({
                                newGame: newGame
                            })
                        }}>
                    {helper.formatHeading('Remove')}
                </button>
            </div>
        </div>
    }

    render() {
        const self = this
        return <div className="games">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col col-12">
                        <h5>{ helper.formatHeading('Add_Game')}
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-6 pr-4 pt-4 pb-4">
                        <Card zDepth={2} style={{borderRadius: 5}}>
                            <div style={{padding: 40, fontFamily: 'Lato'}}>
                                <h6 className="mb-0">{ helper.formatHeading('Add_A_New_Game')}</h6>
                                <TextField
                                    value={ self.state.newGame.id }
                                    style={{width: 300}}
                                    floatingLabelText="ID"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    onChange={ (event, value) => {
                                        let newGame = self.state.newGame
                                        newGame.id = value
                                        self.setState({
                                            newGame: newGame
                                        })
                                    }}
                                /><br/>
                                <TextField
                                    value={ self.state.newGame.maxBet }
                                    style={{width: 300}}
                                    floatingLabelText="Max Bet"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    onChange={ (event, value) => {
                                        let newGame = self.state.newGame
                                        newGame.maxBet = value
                                        self.setState({
                                            newGame: newGame
                                        })
                                    }}
                                />
                                <TimePicker
                                    className="mt-4"
                                    format="ampm"
                                    hintText="Start Time"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    value={self.state.newGame.startTime}
                                    onChange={(event, date) => {
                                        let newGame = self.state.newGame
                                        newGame.startTime = date
                                        self.setState({
                                            newGame: newGame
                                        })
                                    }}
                                />
                                <TimePicker
                                    className="mt-4"
                                    format="ampm"
                                    hintText="End Time"
                                    value={self.state.newGame.endTime}
                                    onChange={(event, date) => {
                                        let newGame = self.state.newGame
                                        newGame.endTime = date
                                        self.setState({
                                            newGame: newGame
                                        })
                                    }}
                                /><br/>
                                {   self.state.newGame.parties.map((party, index) =>
                                    <div>
                                        { self.getPartyItem(party, index) }
                                    </div>
                                )}
                                <button className="btn btn-primary mt-2"
                                        onClick={() => {
                                            self.addParty()
                                        }}>
                                    {helper.formatHeading('Add_Party/Odds')}
                                </button>
                                <br/>
                                <button className="btn btn-primary mt-4"
                                        onClick={() => {
                                            self.addGame()
                                        }}>
                                    {helper.formatHeading('Add_Game')}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Games