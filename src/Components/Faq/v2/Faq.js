/**
 * Created by user on 7/11/2017.
 */

import React, {Component} from 'react'

const WOW = require('wowjs');

import Navbar from '../../Base/Navbar/v2/Navbar'
import Footer from '../../Base/Footer/v2/Footer'

const constants = require('./../../Constants')

import './faq.css'

const TOPIC_GENERAL = 'General', TOPIC_FEATURES = 'Features', TOPIC_CROWDSALE = 'Crowdsale', TOPIC_PLATFORM = 'Platform'
const TOPICS = [TOPIC_GENERAL, TOPIC_FEATURES, TOPIC_CROWDSALE, TOPIC_PLATFORM]

const DESCRIPTION_TOPIC_GENERAL = 'New around here? Start with the basics',
    DESCRIPTION_TOPIC_FEATURES = 'Dive deeper into Decent.bet\'s features',
    DESCRIPTION_TOPIC_CROWDSALE = 'Information regarding our Initial Coin Offering (ICO)',
    DESCRIPTION_TOPIC_PLATFORM = 'Short and long term goals of our platform'

class Faq extends Component {

    constructor(props) {
        super(props)
        new WOW.WOW().init();
        this.state = {
            selectedTopic: TOPIC_GENERAL
        }
    }

    getFaq = () => {
        let faq = []
        switch (this.state.selectedTopic) {

            case TOPIC_GENERAL:
                faq.push(this.getQuestion('What is decent.bet?', 'Decent.bet is a transparent and verifiable sports betting and gambling platform hosted on ' +
                    'Smart Contracts in the Ethereum blockchain. Decent.bet allows anyone to buy into houses on the platform and receive returns ' +
                    'based on profits obtained during operations for each quarter.'))
                faq.push(this.getQuestion('What games are offered on the platform?', 'Decent.bet will launch with slots and sports betting ' +
                    'as it\'s initial offering. Decent.bet will constantly release other games as part of the platform in the future, such as ' +
                    'cryptocurrency price betting, craps, roulette and more. Have a look at our roadmap for more information on our future plans.'))
                faq.push(this.getQuestion('How do I place bets on the platform?', 'Any transaction on the Decent.bet ' +
                    'platform requires to use our ERC-20 standard token - DBET. DBETs can be used to place bets on any active games that ' +
                    'have been pushed into the Decent.bet contract.'))
                faq.push(this.getQuestion('What are the fees for placing bets?', 'There are no fees for placing bets apart from Ethereum\'s gas fees.'))
                faq.push(this.getQuestion('Who provides betting lines and game outcomes?', 'All betting lines and game outcomes will be provided by ' +
                    'the houses on Decent.bet. To start with - Decent.bet will provide a single house that\'ll be run and managed by the platform. ' +
                    'All lines & active game outcomes will be pushed in by Decent.bet. In the future, with white labeled houses, other interested ' +
                    'betting companies will be able to setup their own managed houses within the platform.'))
                faq.push(this.getQuestion('Can I bet using Ether?', 'All transactions on the Decent.bet platform requires DBETs to be used. ' +
                    'They could be bought using Ether from any of our partner exchanges.'))
                faq.push(this.getQuestion('How can I trust the house when it comes to game outcomes?', 'All sports bet ' +
                    'outcomes pushed into the contract will be publicly visible on the blockchain. Outcomes can be viewed ' +
                    'to ensure all results that are pushed are accurate. We do not have plans for a consensus mechanism to ' +
                    'decentralize this portion of the platform since it is a complex problem that is being tackled by ' +
                    'multiple platforms right now - still without a stable release. The platform will however, host multiple centralized oracles through ' +
                    'white labeled houses, which would increase the betting operator choices for every user. ' +
                    'If any result turns out to be wrong on the platform, they can be contested and if successful, outcomes could be rolled back.'))
                faq.push(this.getQuestion('What advantages does decent.bet offer over other centralized/decentralized sports betting platforms?',
                    'Decent.bet offers users the opportunity to invest in the house to generate returns without needing ' +
                    'to perform any additional actions. Decent.bet is also the first platform to offer sports betting ' +
                    'that is verifiable on a blockchain. DBETs - our ERC-20 standard tokens - are also designed to ' +
                    'increase in value over time with the introduction of White Label solutions and custom houses in the ' +
                    'future opening doors to multiple options to re-invest DBETs in within the Decent.bet platform.'))
                break

            case TOPIC_FEATURES:
                faq.push(this.getQuestion('How do I "become the house"?', 'Users can become the house by purchasing ' +
                    'shares into the house at the beginning of every quarter. One week prior to the end of every ' +
                    'quarter users will be allowed to buy-in shares for the next quarter or opt to roll over their ' +
                    'current shares to the next quarter. All shares are entitled to quarterly profits distributed to ' +
                    'all shareholders within the platform.'))
                faq.push(this.getQuestion('Is it possible to liquidate shares during a quarter?', 'Shares can be sold ' +
                    'on the "Share Exchange" within the platform. Shares can be sold anytime during the quarter for ' +
                    'any pre-determined amount to other users for DBETs or Ether.'))
                faq.push(this.getQuestion('How do I receive payouts for my shares?',
                    'Shares can be exchanged for your split of the profits from the distribution at the end of every ' +
                    'quarter.'))
                faq.push(this.getQuestion('How much can I expect in terms of returns at the end of every quarter?',
                    'Returns depend on profitability of the house within the quarter and the %age of shares held by each user. ' +
                    'The higher the %age share and profitability, the higher the returns for a user.'))
                faq.push(this.getQuestion('How do I participate in the quarterly lottery?', 'All shareholders in the ' +
                    'Decent.bet house with a minimum of 1000 shares are automatically entered into the quarterly lottery.'))
                faq.push(this.getQuestion('How do I create my own house?', 'White label solutions and custom houses ' +
                    'will be rolled out eventually. Check out our roadmap for more details.'))
                break

            case TOPIC_CROWDSALE:
                faq.push(this.getQuestion('What are the tokens that will be issued during the ICO?', 'Our ERC20 standard ' +
                    'tokens - DBETs - will be distributed throughout the period of the ICO. DBETs will be used for all ' +
                    'transactions on the Decent.bet platform.'))
                faq.push(this.getQuestion('How will ICO funds be used/distributed?',
                    'Decent.bet will be distributing 350M DBETs @ 1000 DBETs per Ether during the ICO. This will represent 70% ' +
                    'of the total supply of DBETs. DBETs will be minted at the end of the ICO to account for Initial House Funds (10%), ' +
                    'Founder\'s supply (18%) and Bounties (2%). The Ether raised during the ICO will be distributed as ' +
                    'follows - 40% Development, 15% Legal, 25% Marketing, 20% Operations.'))
                faq.push(this.getQuestion('How do I obtain DBETs?', 'DBETs can be initially obtained through our ICO ' +
                    'using Ether. After our ICO, they can be obtained from partner exchanges and from winning bets/games, ' +
                    'house shares and lotteries on the platform.'))
                faq.push(this.getQuestion('Which exchanges will DBETs be listed on?', 'We are working on getting DBETs ' +
                    'to be listed on major exchanges. Whenever we have confirmation, it will be announced on our ' +
                    'social channels and be updated in this section.'))
                break

            case TOPIC_PLATFORM:
                faq.push(this.getQuestion('Are there any gambling games as part of the platform?', 'Slots will be the ' +
                    'first game on the Decent.bet platform. Games like Craps, Roulette etc. will be added over time. ' +
                    'Have a look at our roadmap for more information.'))
                faq.push(this.getQuestion('What is Decent C?', 'Decent C is a charitable initiative from decent.bet. ' +
                    '10% of profits generated from the founder\'s share (not exceeding $50,000) in the house for each ' +
                    'quarter will be donated to selected charitable causes. Of course, all donations will be recorded ' +
                    'on the blockchain for public verification.'))
                faq.push(this.getQuestion('How does white labelling work?', 'White labelling allows outside companies/providers to ' +
                    'leverage our technology and implement their betting lines/game outcomes within the Decent.bet ' +
                    'platform, allowing them to make use of the blockchain for their platforms. White label solutions will require a minimum ' +
                    'deposit to be held by companies along with bidding on houses and a shareholder vote to make sure they comply with all ' +
                    'legal requirements and are vetted by shareholders on the platform.'))
                faq.push(this.getQuestion('What is the overall goal/vision behind the platform?', 'To allow anyone to ' +
                    'be Vegas from the comfort of their living rooms.'))
                break
        }
        return faq
    }

    getQuestion = (question, answer) => {
        return {
            question: question,
            answer: answer
        }
    }

    getFAQItem = (faq) => {
        return <div>
            <p className="question">{ '+\t' + faq.question }</p>
            <hr className="divider"/>
            <p className="answer">{ faq.answer }</p>
        </div>
    }

    getTopicItem = (topic) => {
        console.log('getTopicItem: ' + topic)
        const self = this
        return <div style={{
            padding: '20px 0 0 0',
            marginBottom: 10
        }} onClick={() => {
            self.setState({
                selectedTopic: topic
            })
        }}
                    className={ self.state.selectedTopic == topic ? 'selected' : ''}>
            <h5>{ topic.toUpperCase() }</h5>
            <p>{ this.getTopicDescription(topic) }</p>
        </div>
    }

    getTopicDescription = (topic) => {
        switch (topic) {
            case TOPIC_GENERAL:
                return DESCRIPTION_TOPIC_GENERAL
            case TOPIC_FEATURES:
                return DESCRIPTION_TOPIC_FEATURES
            case TOPIC_CROWDSALE:
                return DESCRIPTION_TOPIC_CROWDSALE
            case TOPIC_PLATFORM:
                return DESCRIPTION_TOPIC_PLATFORM
        }
    }

    render() {
        const self = this
        return (
            <div>
                <div className="faq">
                    <Navbar
                        active={ constants.LINK_FAQ }
                        dark={true}
                    />
                    <div className="top">
                    </div>
                    <div className="faq-container">
                        <div className="container">
                            <div className="row">
                                <div className="header">
                                    <h1><span className="questions">QUESTIONS?</span> LOOK HERE</h1>
                                    <p className="text-center">Decent.bet is a transparent, profit sharing, smart
                                        contract
                                        based
                                        sports betting platform and online casino</p>
                                </div>
                            </div>
                            <div className="topics">
                                <div className="row">
                                    <div className="col-4 toc">
                                        <p>TABLE OF CONTENTS</p>
                                        { TOPICS.map((topic) =>
                                            <div className="topic">
                                                <div className="hvr-grow clickable">
                                                    { self.getTopicItem(topic) }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-8">
                                        <div className="selected-topic">
                                            <h3>{ self.state.selectedTopic }</h3>
                                            <h5>{ self.getTopicDescription(self.state.selectedTopic)}</h5>
                                            <hr className="divider"/>
                                            <div className="questions">
                                                {   self.getFaq().map((question) =>
                                                    <div className="q">
                                                        { self.getFAQItem(question) }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer active={constants.LINK_FAQ}/>
            </div>
        )
    }

}

export default Faq