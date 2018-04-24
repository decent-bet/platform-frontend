import React, { Component, Fragment } from 'react'
import { MenuItem } from 'material-ui'
import * as constants from '../../Constants'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import ProviderSelectorItem from './ProviderSelectorItem'

export default class ProviderSelector extends Component {
    onClickListener = item => {
        this.props.onProviderChangeListener(null, 0, item.dataset.provider)
    }
    render() {
        return (
            <MenuItem
                className="menu-item"
                leftIcon={
                    <FontAwesomeIcon
                        icon="wrench"
                        className="menu-icon fa-fw"
                    />
                }
                primaryText="Connected to:"
                menuItems={
                    <Fragment>
                        <ProviderSelectorItem
                            label="DBET Node"
                            selectedProvider={this.props.gethNodeProvider}
                            providerUrl={constants.PROVIDER_DBET}
                            onProviderChangeListener={
                                this.props.onProviderChangeListener
                            }
                        />

                        <ProviderSelectorItem
                            label="Local Node"
                            providerUrl={constants.PROVIDER_LOCAL}
                            selectedProvider={this.props.gethNodeProvider}
                            onProviderChangeListener={
                                this.props.onProviderChangeListener
                            }
                        />

                        <ProviderSelectorItem
                            label="Infura"
                            providerUrl={constants.PROVIDER_INFURA}
                            selectedProvider={this.props.gethNodeProvider}
                            onProviderChangeListener={
                                this.props.onProviderChangeListener
                            }
                        />
                    </Fragment>
                }
            />
        )
    }
}
