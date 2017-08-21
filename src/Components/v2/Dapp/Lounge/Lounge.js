/**
 * Created by user on 8/21/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'

const constants = require('./../../Constants')

import './lounge.css'

const styles = {
    card: {
        borderRadius: 8,
        background: constants.COLOR_PRIMARY,
        cursor: 'pointer'
    }
}

class Lounge extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <div className="lounge">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="text-center">DECENT<span className="color-gold">.BET</span> LOUNGE
                        </h1>
                    </div>
                </div>
                <div className="row" style={{marginTop: 50}}>
                    <div className="col-12">
                        <h3 className="sub-header text-center">OFFERINGS</h3>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="offset-2 col-4">
                        <Card style={ styles.card }
                              className="hvr-float">
                            <img className="offering"
                                 src={process.env.PUBLIC_URL + "/assets/img/backgrounds/slots.jpg"}/>
                        </Card>
                        <p className="text-center mt-3">SLOTS</p>
                    </div>
                    <div className="col-4">
                        <Card style={ styles.card }
                              className="hvr-float">
                            <img className="offering"
                                 src={process.env.PUBLIC_URL + "/assets/img/backgrounds/sports-betting.jpg"}/>
                        </Card>
                        <p className="text-center mt-3">SPORTSBOOK</p>
                    </div>
                </div>
            </div>

        </div>
    }

}

export default Lounge