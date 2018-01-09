import React, {Component} from 'react'

import SportsBook from './Pages/Sportsbook/Sportsbook'

import './portal.css'

const constants = require('../../Constants')

class Portal extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="portal">
                <SportsBook/>
            </div>
        )
    }


}

export default Portal