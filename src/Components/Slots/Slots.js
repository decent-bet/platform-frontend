/**
 * Created by user on 7/4/2017.
 */

import React, {Component} from 'react'

import $ from 'jquery'

import Iframe from '../Base/Iframe'

import './slots.css'

let frameWindow

class Slots extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="slots">
                <Iframe
                    id="slots-iframe"
                    url={ process.env.PUBLIC_URL + '/slots-game' }
                    width="900px"
                    height="600px"
                    display="initial"
                    position="relative"
                    allowFullScreen/>
            </div>
        )
    }

}

export default Slots