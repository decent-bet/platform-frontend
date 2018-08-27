/**
 * Created by user on 7/17/2017.
*/

import Helper from '../Helper'

const helper = new Helper()

const LOCAL_URL = 'http://localhost:3030/api'
const PUBLIC_URL = 'https://api.decent.bet'

let BASE_URL = helper.isDev() ? LOCAL_URL : PUBLIC_URL

const request = require('request')

class DecentPrelaunchAPI {

    subscribe = (email, callback) => {
        let url = BASE_URL + '/subscribe/' + email
        let options = {
            url: url,
            method: 'POST'
        }
        request(options, (err, response, body) => {
            try {
                body = JSON.parse(body)
                callback(err, body)
            } catch (e) {
                callback(e, body)
            }
        })
    }

}

export default DecentPrelaunchAPI