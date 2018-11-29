import React, { Component } from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { IAppDrawerItemProps } from './IAppDrawerItemProps'

export default class AppDrawerItem extends Component<IAppDrawerItemProps> {
    private onClick = () => {
        this.props.onViewChangeListener(this.props.viewToSelect)
    }

    public render() {
        let itemClasses = this.props.isSelected
            ? 'menu-item selected'
            : 'menu-item'
        return (
            <ListItem
                button={true}
                className={itemClasses}
                onClick={this.onClick}
            >
                <ListItemIcon>{this.props.icon}</ListItemIcon>
                <ListItemText primary={this.props.title} />
            </ListItem>
        )
    }
}
