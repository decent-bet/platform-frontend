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
                primaryText={this.props.title}
                leftIcon={
                    <FontAwesomeIcon
                        icon={this.props.iconClass}
                        className="fa-fw"
                    />
                }
            />
        )
    }
}
