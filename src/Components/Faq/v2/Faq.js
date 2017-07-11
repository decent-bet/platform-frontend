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
    DESCRIPTION_TOPIC_FEATURES = 'Dive deeper into decent.bet\'s features',
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
                faq.push(this.getQuestion('What is decent.bet?', 'Decent.bet is a decentralized betting platform hosted on ' +
                    'Smart Contracts in the Ethereum blockchain. Decent.bet allows anyone to buy into the house and receive returns ' +
                    'based on profits obtained during each quarter.'))
                faq.push(this.getQuestion('What games are offered on the platform?', 'Decent.bet will launch with sports betting ' +
                    'as it\'s initial offering. Decent.bet will constantly release other games as part of the platform in the future.' +
                    'Have a look at our roadmap for more information on our future plans.'))
                faq.push(this.getQuestion('How do I place bets on the platform?', 'Any transaction on the Decent.bet ' +
                    'platform requires to use our ERC-20 standard token - DBET. DBETs can be used to place bets on any active games that ' +
                    'have been pushed into the Decent.bet contract.'))
                faq.push(this.getQuestion('What are the fees for placing bets?', 'There are no fees for placing bets apart from Ethereum\'s gas fees.'))
                faq.push(this.getQuestion('Who provides betting lines?', 'To start with - Decent.bet will provide a ' +
                    'single house run & managed by the platform. All lines & active game outcomes will be pushed in by Decent.bet. ' +
                    'In the future, with white labeling solutions, other capable betting companies will be able to setup their own ' +
                    'houses with their betting lines within the platform.'))
                faq.push(this.getQuestion('Can I bet using Ether?', 'All transactions on the decent.bet platform requires DBETs to be used. ' +
                    'They could be bought using Ether from any of our partner exchanges.'))
                faq.push(this.getQuestion('How can I trust the house when it comes to game outcomes?', 'All sports bet ' +
                    'outcomes pushed into the contract are publicly visible on the blockchain. Outcomes can be viewed ' +
                    'to ensure all results that are pushed are accurate. We do not have a consensus mechanism to ' +
                    'decentralize this portion of the platform since it would open doors to large amounts of risk ' +
                    'through false outcome attacks. If any result turns out to be wrong from decent.bet, they can be ' +
                    'contested and outcomes could be rolled back.'))
                faq.push(this.getQuestion('How does decentralization help in betting/gambling?', 'Unlike traditional centralized gambling and betting platforms where ' +
                    'outcomes, odds, payouts etc. can\'t be verified by the end-user, in a decentralized platform like decent.bet - users can verify every aspect of the ' +
                    'process by viewing state data on the blockchain. This means that it would be impossible for the platform to cheat/trick end users without ' +
                    'publishing it on the blockchain.'))
                faq.push(this.getQuestion('What advantages does decent.bet offer over other centralized/decentralized options?',
                    'Decent.bet offers users the opportunity to invest in the house to generate returns without needing ' +
                    'to perform any additional actions. Decent.bet is also the first platform to offer sports betting ' +
                    'that is verifiable on a blockchain. DBETs - our ERC-20 standard tokens - are also designed to ' +
                    'increase in value over time with the introduction of White Labeling and custom houses in the future.'))
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
                    'Shares can be redeemed for your split of the profits from the distribution at the end of every ' +
                    'quarter.'))
                faq.push(this.getQuestion('How much can I expect in terms of returns at the end of every quarter?',
                    'Returns depend on profitability of the house within the quarter and the %age of shares held by each user. ' +
                    'The higher the %age share and profitability, the higher the returns for a user.'))
                faq.push(this.getQuestion('How do I participate in the quarterly lottery?', 'All shareholders in the ' +
                    'decent.bet house are automatically entered into the quarterly lottery.'))
                faq.push(this.getQuestion('How do I create my own house?', 'White label solutions and custom houses ' +
                    'will be rolled out eventually. Check out our roadmap for more details.'))
                break

            case TOPIC_CROWDSALE:
                faq.push(this.getQuestion('What are the tokens that will be issued during the ICO?', 'Our ERC20 standard ' +
                    'tokens - DBETs - will be distributed throughout the period of the ICO. DBETs will be used for all ' +
                    'transactions on the decent.bet platform.'))
                faq.push(this.getQuestion('How will ICO funds be used/distributed?',
                    'We will be looking to raise 50,000 Ether @ 1000 DBETs per Ether. Ether will be distributed as ' +
                    'follows - 43% Development, 12% Legal, 30% Marketing, 15% Operations. ' +
                    'The final amount of DBETs issued will account for 70% of total supply. Tokens will be minted to ' +
                    'account for - initial house funds (20%), founder\'s supply (8%) and bounties (2%)'))
                faq.push(this.getQuestion('How do I obtain DBETs?', 'DBETs can be initially obtained through our ICO ' +
                    'using Ether. After our ICO, they can be obtained from partner exchanges and from winning bets, ' +
                    'house shares and lottery on the platform.'))
                faq.push(this.getQuestion('Which exchanges will DBETs be listed on?', 'We are working on getting DBETs ' +
                    'to be listed on major exchanges. Whenever we have confirmation, we will announce it on our ' +
                    'social channels and update this section.'))
                break

            case TOPIC_PLATFORM:
                faq.push(this.getQuestion('Are there any gambling games as part of the platform?', 'Games like Blackjack, ' +
                    'slots and craps will be added over time to the platform. Have a look at our roadmap for more ' +
                    'information.'))
                faq.push(this.getQuestion('What is Decent C?', 'Decent C is a charitable initiative from decent.bet. ' +
                    'A %age of all profits for each quarter will be donated to worthy charitable causes around the world and ' +
                    'of course, all recorded on the blockchain for public verification.'))
                faq.push(this.getQuestion('How does white labelling work?', 'White labelling allows outside companies to ' +
                    'leverage our technology and implement their betting lines within the platform to allow them to ' +
                    'make use of the blockchain for their platforms. White label solutions will require a minimum ' +
                    'deposit to be paid by companies along with stringent background checks to make sure they comply with all ' +
                    'legal requirements.'))
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
            height: 75,
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
                <Footer/>
            </div>
        )
    }

}

export default Faq