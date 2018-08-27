import React, { Component } from 'react'
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    SvgIcon
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class DashboardDrawerItem extends Component {
    onClick = () => this.props.onViewChangeListener(this.props.viewToSelect)
    render() {
        let itemClasses = this.props.isSelected
            ? 'menu-item selected'
            : 'menu-item'
        return (
            <ListItem button className={itemClasses} onClick={this.onClick}>
                <ListItemIcon>
                    <SvgIcon>
                        <FontAwesomeIcon
                            icon={this.props.iconClass}
                            className="fa-fw"
                        />
                    </SvgIcon>
                </ListItemIcon>
                <ListItemText primary={this.props.title} />
            </ListItem>
        )
    }
}
