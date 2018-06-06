import React, { Component } from 'react'
import { ListItem, ListItemText } from '@material-ui/core'

export default class ProviderSelectorItem extends Component {
    onClickListener = () =>
        this.props.onProviderChangeListener(this.props.providerUrl)

    render() {
        let classes =
            this.props.selectedProvider === this.props.providerUrl
                ? 'menu-item selected'
                : 'menu-item'
        return (
            <ListItem button className={classes} onClick={this.onClickListener}>
                <ListItemText inset primary={this.props.label} />
            </ListItem>
        )
    }
}
