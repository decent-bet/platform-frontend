import React, { Component } from 'react'
import { MenuItem } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class DashboardDrawerItem extends Component {
    onClick = event => this.props.onViewChangeListener(this.props.viewToSelect)
    render() {
        let itemClasses = this.props.isSelected
            ? 'menu-item selected'
            : 'menu-item'
        return (
            <MenuItem
                className={itemClasses}
                onClick={this.onClick}
                leftIcon={
                    <FontAwesomeIcon
                        icon={this.props.iconClass}
                        className="menu-icon fa-fw"
                    />
                }
            >
                {this.props.title}
            </MenuItem>
        )
    }
}
