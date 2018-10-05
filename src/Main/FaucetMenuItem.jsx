import React from 'react'
import { ListItem, ListItemIcon, ListItemText, Avatar } from '@material-ui/core'
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
                <Avatar src={vechainIcon} style={{height: 21, width: 21, padding: 3, backgroundColor: '#ffffff'}}>
                </Avatar>
            </ListItemIcon>

            <ListItemText>Claim Faucet</ListItemText>
        </ListItem>
    )
}
