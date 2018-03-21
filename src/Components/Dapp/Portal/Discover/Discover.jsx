import React, {Component} from 'react'
import {Card, Tab, Tabs} from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './discover.css'

const styles = {
    inkbar: {
        background: '#f2b45c'
    },
    tabItemContainer: {
        height: 60,
        background: 'rgba(0,0,0,0)',
        borderBottom: 'solid 1px'
    },
    card: (_offering) => {
        return {
            borderRadius: 8,
            height: 115,
            background: 'url(' + process.env.PUBLIC_URL + '/assets/img/offerings/' + _offering.imgUrl + ')',
            backgroundSize: 'cover',
            backgroundRepeat: 'none'
        }
    }
}

class Discover extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offerings: [
                {
                    imgUrl: 'craps.png',
                    name: 'Craps'
                },
                {
                    imgUrl: 'sportsbook.png',
                    name: 'Sportsbook'
                },
                {
                    imgUrl: 'roulette.png',
                    name: 'Roulette'
                },
                {
                    imgUrl: 'blackjack.png',
                    name: 'Blackjack'
                },
                {
                    imgUrl: 'slots.png',
                    name: 'Slots'
                }
            ]
        }
    }

    views = () => {
        const self = this
        return {
            cover: () => {
                return <div className="col-12 cover">
                    <img src={process.env.PUBLIC_URL + '/assets/img/backgrounds/sportsbook-main.png'}/>
                </div>
            },
            tabs: () => {
                return <div className="col-6 py-2 pl-3 pr-0">
                    <Tabs
                        className="tabs"
                        inkBarStyle={styles.inkbar}
                        tabItemContainerStyle={styles.tabItemContainer}>
                        <Tab
                            label={<p className="mb-0">
                                <FontAwesomeIcon icon="heart" /> Favorites
                            </p>}
                            buttonStyle={styles.button}/>
                        <Tab
                            label={<p className="mb-0">
                                <FontAwesomeIcon icon="id-badge" /> New
                            </p>}
                            buttonStyle={styles.button}/>
                        <Tab
                            label={<p className="mb-0">
                                <FontAwesomeIcon icon="star" /> Killer Games
                            </p>}
                            buttonStyle={styles.button}/>
                    </Tabs>
                </div>
            },
            topRight: () => {
                return <div className="col-6 py-2 pl-0 pr-3">
                    <div className="top-right">
                        <p className="text-right text-uppercase clickable">
                            Favorite Slots <FontAwesomeIcon icon="caret-right" />
                        </p>
                    </div>
                </div>
            },
            offerings: () => {
                return <div className="col-12">
                    <div className="container mt-3">
                        <div className="row">
                            { self.state.offerings.map((_offering, index) =>
                                self.views().offering(_offering, index)
                            )}
                        </div>
                    </div>
                </div>
            },
            offering: (_offering, index) => {
                return <div
                    className={"col offering " + (index != (self.state.offerings.length - 1) ? "pr-1" : "pr-2")}>
                    <Card
                        style={styles.card(_offering)}
                        className="clickable">
                    </Card>
                    <p className="mt-3 ml-2">
                        {_offering.name} <FontAwesomeIcon icon="caret-right" className="ml-3 icon" />
                    </p>
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="discover">
                <div className="container home">
                    <div className="row">
                        {self.views().cover()}
                        {self.views().tabs()}
                        {self.views().topRight()}
                        {self.views().offerings()}
                    </div>
                </div>
            </div>
        )
    }


}

export default Discover