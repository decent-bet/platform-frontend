/**
 * Created by user on 10/5/2017.
 */

import React, {Component} from 'react'

import Iframe from '../../../Base/Iframe'

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            channel: {}
        }
    }

    render() {
        return <div className="container">
            <div className="row">
                <div className="col mx-auto">
                    <Iframe
                        id="slots-iframe"
                        url={ process.env.PUBLIC_URL + '/slots-game' }
                        width="900px"
                        height="600px"
                        display="initial"
                        position="relative"
                        allowFullScreen/>
                </div>
            </div>
        </div>
    }

}

export default Game