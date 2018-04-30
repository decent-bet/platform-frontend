import React, { Component } from 'react'
import { MenuItem } from 'material-ui'

export default class ProviderSelectorItem extends Component {
    onClickListener = () =>
        this.props.onProviderChangeListener(this.props.providerUrl)

    render() {
        let classes = this.props.selectedProvider === this.props.providerUrl ?
            'menu-item selected' : 'menu-item'
        return (
            <MenuItem
                className={classes}
                onClick={this.onClickListener}
                primaryText={this.props.label}
            />
        )
    }
}
