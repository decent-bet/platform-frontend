import React, { FunctionComponent } from 'react'
import {
    ListItem,
    ListItemText,
    Button,
    List,
    ListItemIcon
} from '@material-ui/core'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'

const EndSession: FunctionComponent<any> = props => {
    const { details, linkButtonClass, url } = props

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <ExitToAppRoundedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="End Session" />
            </ListItem>

            <List disablePadding={true} dense={true}>
                {details.finalized ? (
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
                                secondary={
                                    <>Final balance: {details.finalBalance}</>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                inset={true}
                                secondary={<>Ended at: {details.time}</>}
                            />
                        </ListItem>
                    </>
                ) : (
                    <ListItem>
                        <ListItemText
                            inset={true}
                            secondary="channel not finalized"
                        />
                    </ListItem>
                )}
            </List>
        </>
    )
}

export default EndSession
