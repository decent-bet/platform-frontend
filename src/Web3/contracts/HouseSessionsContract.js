import BaseContract from './BaseContract'

export default class HouseSessionsContract extends BaseContract {
    // Mapping (uint => Session)
    getSession(sessionNumber) {
        return this.instance.methods.sessions(sessionNumber).call()
    }
}
