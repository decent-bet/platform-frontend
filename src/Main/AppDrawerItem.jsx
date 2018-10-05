import React, { Component } from 'react'
import {
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export default class AppDrawerItem extends Component {
    onClick = () => this.props.onViewChangeListener(this.props.viewToSelect)
    render() {
        let itemClasses = this.props.isSelected
            ? 'menu-item selected'
            : 'menu-item'
        return (
            <ListItem button className={itemClasses} onClick={this.onClick}>
                <ListItemIcon>
                    {this.props.icon}
                </ListItemIcon>
                <ListItemText primary={this.props.title} />
            </ListItem>
        )
    }
}
