/**
 * Created by user on 6/25/2017.
 */

import React, {Component} from 'react'

import './footer.css'

class Footer extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCurrentYear = () => {
        return new Date().getFullYear()
    }

    render() {
        return (
            <div className="footer">
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-7 offset-3">
                                <a href="#" className="link">ABOUT
                                </a>
                                <a href="#" className="link">WHITEPAPER
                                </a>
                                <a href="#" className="link">ROADMAP
                                </a>
                                <a href="#" className="link">FAQ
                                </a>
                                <div className="icons">
                                    <a href="#"><span className="fa fa-facebook icon"/></a>
                                    <a href="#"><span className="fa fa-twitter icon"/></a>
                                    <a href="#"><span className="fa fa-instagram icon"/></a>
                                </div>
                            </div>
                        </div>
                        <div className="row bottom">
                            <div className="col-6">
                                <small>ALL RIGHTS RESERVED DECENT.BET</small>
                            </div>
                            <div className="col-6">
                                <img src="assets/img/logos/dbet-white.png" className="logo float-right"/>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }

}

export default Footer