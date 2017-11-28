import React, {Component} from 'react'

import Discover from './Pages/Discover/Discover'
import SportsBook from './Pages/Sportsbook/Sportsbook'
import Navbar from './Components/Navbar'

import './portal.css'

const constants = require('../../Constants')

class Portal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active: constants.PORTAL_PAGE_SPORTSBOOK
        }
    }

    views = () => {
        const self = this
        return {
            navbar: () => {
                return <Navbar
                    active={self.state.active}
                    onSelectPage={(page) => {
                        self.setState({
                            active: page
                        })
                    }}
                />
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="portal">
                {self.views().navbar()}
                {   self.state.active == constants.PORTAL_PAGE_DISCOVER &&
                <Discover/>
                }
                {   self.state.active == constants.PORTAL_PAGE_SPORTSBOOK &&
                <SportsBook/>
                }
            </div>
        )
    }


}

export default Portal