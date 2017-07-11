/**
 * Created by user on 4/30/2017.
 */

import React, {Component} from 'react'

const LINK_HOME = 'home', LINK_WHITE_PAPER = 'whitepaper', LINK_ROADMAP = 'roadmap', LINK_FAQ = 'faq', LINK_ICO = 'ico'
const FORMATTED_LINK_HOME = 'Home', FORMATTED_LINK_WHITE_PAPER = 'White Paper', FORMATTED_LINK_ROADMAP = 'Roadmap',
    FORMATTED_LINK_FAQ = 'FAQ', FORMATTED_LINK_ICO = 'Crowdsale'
const links = [LINK_HOME, LINK_WHITE_PAPER, LINK_ROADMAP, LINK_FAQ, LINK_ICO]

const constants = require('./../../../Constants')

class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active: props.active
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.active
        })
    }

    getLinks = () => {
        let _links = []
        for (let i = 0; i < links.length; i++)
            _links.push(this.getLink(links[i]))
        return _links
    }

    getLink = (link) => {
        return <li className={ this.state.active == link ? 'nav-item active' : 'nav-item' }>
            <a className={ this.state.active == link ? 'nav-link' : 'nav-link hvr-underline-from-left' }
               href={ this.getLinkUrl(link) }>{ this.getLinkLabel(link) }
            </a>
        </li>
    }

    getLinkLabel = (link) => {
        switch (link) {
            case LINK_HOME:
                return FORMATTED_LINK_HOME
            case LINK_WHITE_PAPER:
                return FORMATTED_LINK_WHITE_PAPER
            case LINK_ROADMAP:
                return FORMATTED_LINK_ROADMAP
            case LINK_FAQ:
                return FORMATTED_LINK_FAQ
            case LINK_ICO:
                return FORMATTED_LINK_ICO
        }
    }

    getLinkUrl = (link) => {
        switch (link) {
            case LINK_HOME:
                return '/'
            case LINK_WHITE_PAPER:
                return '#'
            case LINK_ROADMAP:
                return '/roadmap'
            case LINK_FAQ:
                return '/faq'
            case LINK_ICO:
                return '/ico'
        }
    }

    render() {
        const self = this
        return (
            <nav className="navbar navbar-toggleable-md fixed-top navbar-light">
                <div className="container">
                    <button className="navbar-toggler navbar-toggler-right" type="button"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand" href="#">
                        <p className="hvr-float-shadow"> decent.bet</p>
                    </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto ml-4">
                            { self.getLinks() }
                        </ul>
                        <div className="my-2 my-lg-0">
                            <button className="btn btn-primary mt-1" onClick={ () => {
                                window.location = '/dapp'
                            }}>Bet Now
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

}

export default Navbar