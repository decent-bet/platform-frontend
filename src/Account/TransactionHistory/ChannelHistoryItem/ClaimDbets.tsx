import React, { FunctionComponent } from 'react'
import {
    ListItem,
    ListItemText,
    Button,
    List,
    ListItemIcon
} from '@material-ui/core'
import SaveAltRoundedIcon from '@material-ui/icons/SaveAltRounded'

export interface IClaimDbetsProps {
    details: any
    linkButtonClass: string
    url: string
}

const ClaimDebts: FunctionComponent<IClaimDbetsProps> = props => {
    const { details, linkButtonClass, url } = props

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <SaveAltRoundedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Claim DBETs" />
            </ListItem>

            <List disablePadding={true} dense={true}>
                {details.claimed ? (
                    <>
                        <ListItem>
                            <ListItemText
                                inset={true}
                                secondary={
                                    <>
                                        Transaction Hash:{' '}
                                        <Button
                                            className={linkButtonClass}
                                            color="secondary"
                                            target="_blank"
                                            href={`${url}/${
                                                details.transactionHash
                                            }`}
                                        >
                                            {details.transactionHash}
                                        </Button>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                inset={true}
                                secondary={`Claimed DBETs: ${details.amount}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                inset={true}
                                secondary={`Claimed at: ${details.time}`}
                            />
                        </ListItem>
                    </>
                ) : (
                    <ListItem>
                        <ListItemText inset={true} secondary="Not claimed" />
                    </ListItem>
                )}
            </List>
        </>
    )
}

export default ClaimDebts
