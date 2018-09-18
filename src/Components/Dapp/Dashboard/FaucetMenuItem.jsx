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
                <Avatar color="primary">
                    <img style={{ width: '80%' }} src={imgSrc} />
                </Avatar>
            </ListItemIcon>

            <ListItemText>Claim Faucet</ListItemText>
        </ListItem>
    )
}
