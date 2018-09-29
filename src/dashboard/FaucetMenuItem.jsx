import React from 'react'
import { ListItem, ListItemIcon, ListItemText, Avatar } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import vechainIcon from '../assets/img/vechain-96x96.png'

export default function FaucetMenuItem({ onFaucetClickedListener }) {
    // if (provider === PROVIDER_DBET) {
    //     return null
    // }
    return (
        <ListItem
            button
            className="menu-item"
            onClick={onFaucetClickedListener}
        >
            <ListItemIcon>
                <Avatar src={vechainIcon} style={{height: '1.3em', width: '1.3em', padding: '0.1em', backgroundColor: '#ffffff'}}>
                </Avatar>
            </ListItemIcon>

            <ListItemText>Claim Faucet</ListItemText>
        </ListItem>
    )
}
