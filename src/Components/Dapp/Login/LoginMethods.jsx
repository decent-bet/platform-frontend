import React, { Fragment } from 'react'
import { DropDownMenu, MenuItem } from 'material-ui'

const constants = require('../../Constants')
const styles = require('../../Base/styles').styles()

export default function LoginMethods({
    loginMethod,
    provider,
    onLoginMethodChangeListener,
    onProviderChangedListener
}) {
    return (
        <Fragment>
            <DropDownMenu
                value={loginMethod}
                onChange={onLoginMethodChangeListener}
                underlineStyle={styles.dropdown.underlineStyle}
                labelStyle={styles.dropdown.labelStyle}
                selectedMenuItemStyle={styles.dropdown.selectedMenuItemStyle}
                menuItemStyle={styles.dropdown.menuItemStyle}
                listStyle={styles.dropdown.listStyle}
            >
                <MenuItem
                    value={constants.LOGIN_MNEMONIC}
                    primaryText="Passphrase"
                    style={styles.menuItem}
                />
                <MenuItem
                    value={constants.LOGIN_PRIVATE_KEY}
                    primaryText="Private key"
                    style={styles.menuItem}
                />
            </DropDownMenu>
            <DropDownMenu
                className="float-right"
                value={provider}
                onChange={onProviderChangedListener}
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
        </Fragment>
    )
}
