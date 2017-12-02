const request = require('request')

import Helper from '../Helper'
const helper = new Helper()

const PUBLIC_URL = ''
const LOCAL_URL = 'http://localhost:3012/api'

const BASE_URL = helper.isDev() ? LOCAL_URL : PUBLIC_URL

class SportsAPI {

    get = (url, callback) => {
        let options = {
            url: url,
            method: 'GET'
        }
        request(options, (err, response, body) => {
            try {
                body = JSON.parse(body)
                if(body.error)
                    err = true
            } catch (e) {
                err = true
            }
            callback(err, body)
        })
    }

    getSports = (callback) => {
        this.get(BASE_URL + '/sports', callback)
    }

    getLeagues = (sportId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/leagues', callback)
    }

    getFixtures = (sportId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/fixtures', callback)
    }

    getOdds = (sportId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/odds', callback)
    }

    getPeriods = (sportId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/periods', callback)
    }

    getLeagueFixtures = (sportId, leagueId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/leagues/' + leagueId + '/fixtures', callback)
    }

    getLeagueSettledFixtures = (sportId, leagueId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/leagues/' + leagueId + '/fixtures/settled', callback)
    }

    getLeagueOdds = (sportId, leagueId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/leagues/' + leagueId + '/odds', callback)
    }

    getLeagueParlayOdds = (sportId, leagueId, callback) => {
        this.get(BASE_URL + '/sports/' + sportId + '/leagues/' + leagueId + '/odds/parlay', callback)
    }

}

export default SportsAPI