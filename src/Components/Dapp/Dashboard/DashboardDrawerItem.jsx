import React, { Component } from 'react'
import { MenuItem } from 'material-ui'

export default class DashboardDrawerItem extends Component {
    onClick = event => this.props.onViewChangeListener(this.props.viewToSelect)
    render() {
        let itemClasses = this.props.isSelected
            ? 'menu-item selected'
            : 'menu-item'
        let iconClasses = `fa fa-${this.props.iconClass} menu-icon`
        return (
            <MenuItem className={itemClasses} onClick={this.onClick}>
                <span className={iconClasses} />
                {`  ${this.props.title}`}
            </MenuItem>
        )
    }
}
