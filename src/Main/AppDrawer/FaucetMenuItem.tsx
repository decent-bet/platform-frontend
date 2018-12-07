import React, { FunctionComponent } from 'react'
import { ListItem, ListItemIcon, ListItemText, Avatar } from '@material-ui/core'
import vechainIcon from '../../assets/img/vechain-96x96.png'

const FaucetMenuItem: FunctionComponent<{
    onFaucetClickedListener: () => void
}> = ({ onFaucetClickedListener }) => {
    return (
        <ListItem
            button={true}
            className="menu-item"
            onClick={onFaucetClickedListener}
        >
            <ListItemIcon>
                <Avatar
                    src={vechainIcon}
                    style={{
                        height: 21,
                        width: 21,
                        padding: 3,
                        backgroundColor: '#ffffff'
                    }}
                />
            </ListItemIcon>

            <ListItemText>Claim Faucet</ListItemText>
        </ListItem>
    )
}

export default FaucetMenuItem
