import BaseContract from './BaseContract'

export default class HouseSessionsContract extends BaseContract {
    // Mapping (uint => Session)
    async getSession(sessionNumber) {
        return await this.instance.methods.sessions(sessionNumber).call()
    }
}
