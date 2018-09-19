import React from 'react'
import { ListItem, ListItemIcon, ListItemText, Avatar } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FaucetMenuItem({ onFaucetClickedListener }) {
    // if (provider === PROVIDER_DBET) {
    //     return null
    // }
    let imgSrc = `${process.env.PUBLIC_URL}/assets/img/icons/vechain-96x96.png`
    return (
        <ListItem
            button
            className="menu-item"
            onClick={onFaucetClickedListener}
        >
            <ListItemIcon>
                <Avatar src={imgSrc} style={{height: '1.3em', width: '1.3em', padding: '0.1em', backgroundColor: '#ffffff'}}>
                </Avatar>
            </ListItemIcon>

            <ListItemText>Claim Faucet</ListItemText>
        </ListItem>
    )
}
