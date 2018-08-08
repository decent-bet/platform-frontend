import BaseContract from './BaseContract'

export default class HouseAuthorizedContract extends BaseContract {

    async getAuthorizedAddresses(index) {
        return await this.instance.methods.authorizedAddresses(index).call()
    }

    async addToAuthorizedAddresses(address) {
        return await this.instance.methods.addToAuthorizedAddresses(address).call()
    }

    async removeFromAuthorizedAddresses(address) {
        return await this.instance.methods.removeFromAuthorizedAddresses(address).call()
    }
}