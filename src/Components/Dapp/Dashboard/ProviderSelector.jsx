import React from 'react'
import { MenuItem, DropDownMenu } from 'material-ui'

const constants = require('../../Constants')
const styles = require('../../Base/styles').styles()

export default function ProviderSelector({
    onProviderChangeListener,
    gethNodeProvider
}) {
    return (
        <MenuItem>
            <p className="mb-0">Select Geth Node</p>
            <DropDownMenu
                value={gethNodeProvider}
                onChange={onProviderChangeListener}
                underlineStyle={styles.dropdown.underlineStyle}
                labelStyle={styles.dropdown.labelStyle}
                selectedMenuItemStyle={styles.dropdown.selectedMenuItemStyle}
                menuItemStyle={styles.dropdown.menuItemStyle}
                listStyle={styles.dropdown.listStyle}
            >
                <MenuItem
                    value={constants.PROVIDER_DBET}
                    primaryText="DBET Node"
                    style={styles.menuItem}
                />
                <MenuItem
                    value={constants.PROVIDER_LOCAL}
                    primaryText="Local Node"
                    style={styles.menuItem}
                />
                <MenuItem
                    value={constants.PROVIDER_INFURA}
                    primaryText="Infura"
                    style={styles.menuItem}
                />
            </DropDownMenu>
        </MenuItem>
    )
}
