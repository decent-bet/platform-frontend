/**
 * Created by user on 5/10/2017.
 */

import React, {Component} from 'react'

let pinnacleAPI = require('pinnacle-sports')

let USERNAME = 'JT967013'
let PASSWORD = 'piggy@123'

let pinnacle = pinnacleAPI.createClient(USERNAME, PASSWORD)

class PinnacleTest extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.testPinnacle()
    }

    testPinnacle = () => {
        pinnacle.get_sports(function(error, result){
            console.log(error);
            console.log(result);
        });
    }

    render() {
        return (
            <div>
                <h1>Pinnacle Test</h1>
                <p>Check console</p>
            </div>
        )
    }

}

export default PinnacleTest