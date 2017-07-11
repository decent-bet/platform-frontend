/**
 * Created by user on 5/24/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import ContractHelper from '../../ContractHelper'
import Helper from '../../Helper'

const contractHelper = new ContractHelper()
const helper = new Helper()

const constants = require('./../../Constants')

import './authorized.css'

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

const styles = {
    errorStyle: {
        color: constants.COLOR_RED
    },
    underlineStyle: {
        borderColor: constants.COLOR_PRIMARY_LIGHT
    },
    floatingLabelStyle: {
        color: constants.COLOR_PRIMARY_LIGHT
    },
    floatingLabelFocusStyle: {
        color: constants.COLOR_PRIMARY_LIGHT
    }
}

class Authorized extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newAuthorizedAddress: '',
            addresses: []
        }
    }

    componentWillMount = () => {
        this.getAuthorizedAddress()
    }

    getAuthorizedAddress = (index) => {
        const self = this
        let _index = index ? index : 0
        contractHelper.getWrappers().house().getAuthorizedAddresses(_index).then((address) => {
            console.log('getAuthorizedAddresses: ' + JSON.stringify(address))
            // Loop through array indices
            if (address != EMPTY_ADDRESS) {
                let addresses = self.state.addresses
                addresses.push(address)
                self.setState({
                    addresses: addresses
                })
                self.getAuthorizedAddress(_index + 1)
            }
        }).catch((err) => {
            // End of array
        })
    }

    addAddress = () => {
        let newAddress = this.state.newAuthorizedAddress
        if (newAddress.length > 0) {
            console.log('Adding address: ' + newAddress + ', ' + (typeof newAddress))
            contractHelper.getWrappers().house().addToAuthorizedAddresses(newAddress).then((added) => {
                console.log('Added new address: ' + newAddress + ' - ' + JSON.stringify(added))
            }).catch((err) => {
                console.log('Error adding new address: ' + err + ', ' + newAddress)
            })
        } else
            console.log('Please enter an address and try again')
    }

    removeAddress = (address) => {
        contractHelper.getWrappers().house().removeFromAuthorizedAddresses(address).then((removed) => {
            console.log('Removed address: ' + address)
        }).catch((err) => {
            console.log('Error removing address: ' + address)
        })
    }

    render() {
        const self = this
        return <div className="authorized">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col col-12">
                        <h5>{ helper.formatHeading('Manage_Authorized_Addresses')}
                        </h5>
                    </div>
                </div>
                <div className="row" style={{marginTop: 30}}>
                    <div className="col col-6 pr-4 pt-4 pb-4">
                        <Card zDepth={2} style={{borderRadius: 5}}>
                            <div style={{padding: 40, fontFamily: 'Lato'}}>
                                <h6 className="mb-0">{ helper.formatHeading('Add_A_New_Authorized_Address')}</h6>
                                <TextField
                                    value={ self.state.newAuthorizedAddress }
                                    style={{width: 300}}
                                    floatingLabelText="Address"
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    onChange={ (event, value) => {
                                        self.setState({
                                            newAuthorizedAddress: value
                                        })
                                    }}
                                /><br/>
                                <p className="info mt-3">Make sure addresses added are vetted and double-checked before
                                    adding
                                    them.
                                    Authorized addresses have full control over sports betting contracts.</p>
                                <button className="btn btn-primary add-address mt-2"
                                        onClick={() => {
                                            self.addAddress()
                                        }}>
                                    {helper.formatHeading('Add_Address')}
                                </button>
                            </div>
                        </Card>
                    </div>
                    <div className="col col-6 pt-4 pl-4 pb-4">
                        <Card zDepth={2} style={{borderRadius: 5, minHeight: 300}}>
                            <div style={{padding: 40, fontFamily: 'Lato'}}>
                                <h6 className="mb-3">{ helper.formatHeading('Authorized_Addresses')}</h6>
                                {   self.state.addresses.map((address, index) =>
                                    <div className="row">
                                        <div className="col col-12">
                                            <p className="address">• { address }</p>
                                        </div>
                                        <div className="col col-12">
                                            <button className="btn btn-primary btn-sm remove float-right"
                                                    onClick={() => {
                                                        self.removeAddress(address)
                                                    }}>
                                                { helper.formatHeading('Remove')}
                                            </button>
                                        </div>
                                        <hr/>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Authorized