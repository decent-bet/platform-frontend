/**
 * Created by user on 6/25/2017.
 */

import React, {Component} from 'react'

const LINK_HOME = 'home', LINK_WHITE_PAPER = 'whitepaper', LINK_ROADMAP = 'roadmap', LINK_FAQ = 'faq'
const FORMATTED_LINK_HOME = 'Home', FORMATTED_LINK_WHITE_PAPER = 'White Paper', FORMATTED_LINK_ROADMAP = 'Roadmap',
    FORMATTED_LINK_FAQ = 'FAQ'
const links = [LINK_HOME, LINK_WHITE_PAPER, LINK_ROADMAP, LINK_FAQ]

import './footer.css'

class Footer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active: props.active
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.active
        })
    }

    getCurrentYear = () => {
        return new Date().getFullYear()
    }

    getLinks = () => {
        let _links = []
        for (let i = 0; i < links.length; i++)
            _links.push(this.getLink(links[i]))
        return _links
    }

    getLink = (link) => {
        return <a className={ this.state.active == link ? 'link active' : 'link' }
                  href={ this.getLinkUrl(link) }>{ this.getLinkLabel(link).toUpperCase() }
        </a>
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
                return '/whitepaper'
            case LINK_ROADMAP:
                return '/roadmap'
            case LINK_FAQ:
                return '/faq'
        }
    }

    render() {
        const self = this
        return (
            <div className="footer">
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-7 offset-3 hidden-md-down">
                                { self.getLinks() }
                                <div className="icons">
                                    <a href="https://www.facebook.com/decentbet/"><span
                                        className="fa fa-facebook icon"/></a>
                                    <a href="https://www.twitter.com/decentbet/"><span className="fa fa-twitter icon"/></a>
                                    <a href="https://www.instagram.com/decentbet/"><span
                                        className="fa fa-instagram icon"/></a>
                                </div>
                            </div>
                            <div className="col-12 hidden-md-up">
                                <div className="text-center">
                                    { self.getLinks() }
                                </div>
                                <div className="icons text-center">
                                    <a href="https://www.facebook.com/decentbet/"><span
                                        className="fa fa-facebook icon"/></a>
                                    <a href="https://www.twitter.com/decentbet/"><span className="fa fa-twitter icon"/></a>
                                    <a href="https://www.instagram.com/decentbet/"><span
                                        className="fa fa-instagram icon"/></a>
                                </div>
                            </div>
                        </div>
                        <div className="row bottom">
                            <div className="col-6">
                                <small>ALL RIGHTS RESERVED DECENT.BET {self.getCurrentYear()}</small>
                            </div>
                            <div className="col-6">
                                <a href="https://decent.bet">
                                    <img src="assets/img/logos/dbet-white.png" className="logo float-right"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }

}

export default Footer