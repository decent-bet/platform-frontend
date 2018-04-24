import React from 'react'
import { MenuItem } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Helper from '../../Helper'
import { PROVIDER_DBET } from '../../Constants'

const helper = new Helper()
const provider = helper.getGethProvider()

export default function FaucetMenuItem({ onFaucetClickedListener }) {
    if (provider !== PROVIDER_DBET) {
        return (
            <MenuItem
                className="menu-item"
                onClick={onFaucetClickedListener}
                leftIcon={
                    <FontAwesomeIcon
                        icon={["fab", "ethereum"]}
                        className="menu-icon fa-fw"
                    />
                }
            >
                Claim Faucet
            </MenuItem>
        )
    }
}
