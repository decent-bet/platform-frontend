import React, { Component } from 'react'
import { MenuItem } from 'material-ui'
import { Link } from 'react-router-dom'

export default class DashboardDrawerItem extends Component {
    render() {
        let itemClasses = this.props.isSelected
            ? 'menu-item selected'
            : 'menu-item'
        let iconClasses = `fa fa-${this.props.iconClass} menu-icon`
        return (
            <Link to={this.props.viewToSelect}>
                <MenuItem className={itemClasses}>
                    <span className={iconClasses} />
                    {`  ${this.props.title}`}
                </MenuItem>
            </Link>
        )
    }
}
