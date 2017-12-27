/**
 * Created by user on 8/21/2017.
 */

import React, {Component} from 'react'

const constants = require('./../../Constants')

import './balances.css'

class Balances extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <div className="lounge">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="text-center">DECENT<span className="color-gold">.BET</span> BALANCES
                        </h1>
                    </div>
                </div>
            </div>

        </div>
    }

}

export default Balances