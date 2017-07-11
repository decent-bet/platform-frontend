/**
 * Created by user on 5/11/2017.
 */

import React, {Component} from 'react'

import './footer.css'

class Footer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hideDivider: props.hideDivider ? props.hideDivider : false
        }
    }

    getCurrentYear = () => {
        return new Date().getFullYear()
    }

    render() {
        const self = this
        return (
            <div className="footer">
                {   !self.state.hideDivider &&
                <hr/>
                }
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col col-8">
                                <p className="copyright">©{self.getCurrentYear()} <span
                                    className="logo-text">decent.bet</span></p>
                            </div>
                            <div className="col col-2 sitemap wow fadeIn">
                                <h4>Sitemap</h4>
                                <a href="#" className="hvr-grow">Home</a><br/>
                                <a href="#" className="hvr-grow">Bet Now</a><br/>
                                <a href="#" className="hvr-grow">Crowdsale</a><br/>
                                <a href="#" className="hvr-grow">White Paper</a><br/>
                                <a href="#" className="hvr-grow">FAQ</a><br/>
                            </div>
                            <div className="col col-2 social wow fadeIn">
                                <h4>Social</h4>
                                <a href="#" className="hvr-grow">Facebook</a><br/>
                                <a href="#" className="hvr-grow">Twitter</a><br/>
                                <a href="#" className="hvr-grow">Slack</a><br/>
                                <a href="#" className="hvr-grow">Bitcointalk</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }

}

export default Footer