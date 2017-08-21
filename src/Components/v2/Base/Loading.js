/**
 * Created by user on 5/18/2017.
 */

import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'

const constants = require('./../Constants')

class Loading extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: props.message,
            color: props.color ? props.color : constants.COLOR_WHITE
        }
    }

    render() {
        const self = this
        return (
            <div className="loading">
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-12 my-auto">
                            <div className="d-flex justify-content-center">
                                <CircularProgress
                                    size={60}
                                    color={ constants.COLOR_RED }
                                />
                            </div>
                            <p className="mt-4 text-center"
                               style={{color: self.props.color}}>{ this.state.message }</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Loading