/**
 * Created by user on 4/30/2017.
 */

import React, {Component} from 'react'

const LINK_HOME = 'home', LINK_WHITE_PAPER = 'whitepaper', LINK_ROADMAP = 'roadmap', LINK_FAQ = 'faq'
const FORMATTED_LINK_HOME = 'Home', FORMATTED_LINK_WHITE_PAPER = 'White Paper', FORMATTED_LINK_ROADMAP = 'Roadmap',
    FORMATTED_LINK_FAQ = 'FAQ'
const links = [LINK_HOME, LINK_WHITE_PAPER, LINK_ROADMAP, LINK_FAQ]

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
        return <li className={ (this.state.active == link ? 'nav-item active' : 'nav-item') + ' mr-2' }>
            <a className={ this.state.active == link ? 'nav-link' : 'nav-link hvr-underline-from-left' }
               href={ this.getLinkUrl(link) }>{ this.getLinkLabel(link).toUpperCase() }
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
                        <img className="logo" src="assets/img/logos/dbet-white.png"/>
                    </a>
                    <div className="collapse navbar-collapse pt-2" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto mr-4">
                            { self.getLinks() }
                        </ul>
                        <div className="my-2 my-lg-0">
                            <button className="btn btn-primary mt-1 font-weight-bold" onClick={ () => {
                                window.location = '/dapp'
                            }}>JOIN ICO
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

}

export default Navbar