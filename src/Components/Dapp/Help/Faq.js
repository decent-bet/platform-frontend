/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'

class Faq extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentWillMount = () => {

    }

    render() {
        const self = this
        return <div>
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-12">
                        <h1 style={{
                            fontSize: 20
                        }}>F A Q</h1>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Faq