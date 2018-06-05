import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Helper from '../../Helper'
import { PROVIDER_DBET } from '../../Constants'

const helper = new Helper()
const provider = helper.getGethProvider()

export default function FaucetMenuItem({ onFaucetClickedListener }) {
    if (provider !== PROVIDER_DBET) {
        return (
            <ListItem
                button
                className="menu-item"
                onClick={onFaucetClickedListener}
            >
                <ListItemIcon>
                    <FontAwesomeIcon
                        icon={['fab', 'ethereum']}
                        className="fa-fw"
                    />
                </ListItemIcon>

                <ListItemText>Claim Faucet</ListItemText>
            </ListItem>
        )
    }
}
