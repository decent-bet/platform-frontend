import React, {Component} from 'react'

import Helper from '../../../Helper'

import './navbar.css'

const constants = require('../../../Constants')
const helper = new Helper()

class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active: props.active
        }
    }

    views = () => {
        const self = this
        return {
            link: (page) => {
                return <li className={"nav-item clickable " + (self.state.active == page ? 'active' : '')}>
                    <a className="nav-link" onClick={() => {
                        if(self.state.active != page) {
                            self.props.onSelectPage(page)
                            self.setState({
                                active: page
                            })
                        }
                    }}>{helper.capitalize(page)}</a>
                </li>
            }
        }
    }

    render() {
        const self = this
        return <nav className="navbar navbar-toggleable-md">
            <button className="navbar-toggler navbar-toggler-right"
                    type="button" data-toggle="collapse" data-target="#navbar-toggler"
                    aria-controls="navbar-toggler" aria-expanded="false">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto mt-2 mt-md-0">
                    <div className="container">
                        <div className="row">
                            {self.views().link(constants.PORTAL_PAGE_DISCOVER)}
                            {self.views().link(constants.PORTAL_PAGE_SPORTSBOOK)}
                            {self.views().link(constants.PORTAL_PAGE_SLOTS)}
                        </div>
                    </div>
                </ul>
            </div>
        </nav>
    }

}

export default Navbar