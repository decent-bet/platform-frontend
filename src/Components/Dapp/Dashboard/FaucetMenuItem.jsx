import React from 'react'
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    SvgIcon
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
                <SvgIcon>
                    <FontAwesomeIcon
                        icon={['fab', 'ethereum']}
                        className="fa-fw"
                    />
                </SvgIcon>
            </ListItemIcon>

            <ListItemText>Claim Faucet</ListItemText>
        </ListItem>
    )
}
