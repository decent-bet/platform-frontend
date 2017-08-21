/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'

const constants = require('./../../../Constants')

class Craps extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount = () => {

    }

    render() {
        return <div>
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col col-12">
                        <h1 style={{
                            fontSize: 20
                        }}>C A S I N O&ensp;&ensp;>&ensp;&ensp;C R A P S</h1>
                    </div>
                    <div className="col col-12">
                        <div className="text-center">
                            <div className="col offset-4">
                                <div className="floating">
                                    <img src="assets/img/icons/craps.png"
                                         style={{height: 400, width: 400}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col offset-1">
                        <h5 style={{
                            color: constants.COLOR_PRIMARY_LIGHT,
                            textTransform: 'uppercase',
                            fontSize: 14
                        }}
                            className="text-center">
                            C r a p s&ensp;a r e&ensp;n o t&ensp;a v a i l a b l e&ensp;a t&ensp;t h e&ensp;m o m e n t.
                            <br/><br/>
                            C h e c k&ensp;o u t&ensp;o u r&ensp;r o a d m a p&ensp;t o&ensp;f i n d&ensp;o u t&ensp;
                            w h e n&ensp;i t ' l l&ensp;b e&ensp;r e l e a s e d.
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Craps