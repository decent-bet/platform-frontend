import BaseContract from './BaseContract'

export default class HouseAuthorizedContract extends BaseContract {

    getAuthorizedAddresses(index) {
        return this.instance.methods.authorizedAddresses(index).call()
    }

    addToAuthorizedAddresses(address) {
        return this.instance.methods.addToAuthorizedAddresses(address).call()
    }

    removeFromAuthorizedAddresses(address) {
        return this.instance.methods.removeFromAuthorizedAddresses(address).call()
    }
}