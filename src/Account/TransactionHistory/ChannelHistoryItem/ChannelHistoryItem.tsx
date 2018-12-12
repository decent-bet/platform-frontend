import React, { Component, MouseEvent } from 'react'
import classnames from 'classnames'
import IChannelHistoryItemProps from './IChannelHistoryItemProps'
import {
    IChannelHistoryItemState,
    DefaultState
} from './ChannelHistoryItemState'
import {
    // Grid,
    IconButton,
    Typography,
    Collapse,
    withStyles,
    CardContent,
    Card,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Divider
} from '@material-ui/core'
import styles from './styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import SaveAltRoundedIcon from '@material-ui/icons/SaveAltRounded'
import { VEFORGE_URL } from '../../../config'

class ChannelHistoryItem extends Component<
    IChannelHistoryItemProps,
    IChannelHistoryItemState
> {
    public state: Readonly<IChannelHistoryItemState> = DefaultState

    private didClickOnToogleExpand = (_event: MouseEvent): void => {
        this.setState(state => ({ expanded: !state.expanded }))
    }

    public render() {
        const { classes, channel } = this.props
        return (
            <Card className={classes.card}>
                <CardHeader
                    title={
                        <Typography color="primary" variant="body1">
                            Channel ID: {channel.id}
                        </Typography>
                    }
                    subheader={
                        <Typography color="secondary" variant="body2">
                            Created: {channel.createTime}
                        </Typography>
                    }
                    action={
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded
                            })}
                            onClick={this.didClickOnToogleExpand}
                        >
                            {<KeyboardArrowDownIcon />}
                        </IconButton>
                    }
                />
                <Collapse
                    in={this.state.expanded}
                    timeout="auto"
                    unmountOnExit={true}
                >
                    <CardContent>
                        <List
                            disablePadding={true}
                            component="nav"
                            subheader={
                                <>
                                    <Typography>Nonce:</Typography>
                                    <Typography color="secondary">
                                        {channel.channelNonce}
                                    </Typography>
                                </>
                            }
                        >
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleRoundedIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Start session" />
                            </ListItem>
                            <List disablePadding={true} dense={true}>
                                <ListItem>
                                    <ListItemText
                                        inset={true}
                                        secondary={
                                            <>
                                                Transaction Hash:
                                                <Button
                                                    className={
                                                        classes.linkButton
                                                    }
                                                    color="secondary"
                                                    target="_blank"
                                                    href={`${VEFORGE_URL}/${
                                                        channel.txCreateHash
                                                    }`}
                                                >
                                                    {channel.txCreateHash}
                                                </Button>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        inset={true}
                                        secondary={`Initial deposit: ${
                                            channel.initialDeposit
                                        }`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        inset={true}
                                        secondary={`Started at: ${
                                            channel.createTime
                                        }`}
                                    />
                                </ListItem>
                            </List>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <ExitToAppRoundedIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="End Session"
                                    secondary={
                                        channel.txEndHash ? '' : 'Not finalized'
                                    }
                                />
                            </ListItem>
                            {channel.txEndHash ? (
                                <List disablePadding={true} dense={true}>
                                    <ListItem>
                                        <ListItemText
                                            inset={true}
                                            secondary={
                                                <>
                                                    Transaction Hash:{' '}
                                                    <Button
                                                        className={
                                                            classes.linkButton
                                                        }
                                                        color="secondary"
                                                        target="_blank"
                                                        href={`${VEFORGE_URL}/${
                                                            channel.txEndHash
                                                        }`}
                                                    >
                                                        {channel.txEndHash}
                                                    </Button>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            ) : null}
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <SaveAltRoundedIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Claim DBETs"
                                    secondary={
                                        channel.txClaimedHash
                                            ? ''
                                            : 'Not claimed'
                                    }
                                />
                            </ListItem>
                            {channel.txClaimedHash ? (
                                <List disablePadding={true} dense={true}>
                                    <ListItem>
                                        <ListItemText
                                            inset={true}
                                            secondary={
                                                <>
                                                    Transaction Hash:{' '}
                                                    <Button
                                                        className={
                                                            classes.linkButton
                                                        }
                                                        color="secondary"
                                                        target="_blank"
                                                        href={`${VEFORGE_URL}/${
                                                            channel.txClaimedHash
                                                        }`}
                                                    >
                                                        {channel.txClaimedHash}
                                                    </Button>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            inset={true}
                                            secondary={`Claimed at: ${
                                                channel.claimedTime
                                            }`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            inset={true}
                                            secondary={`Claimed DBETs: ${
                                                channel.claimedDbets
                                            }`}
                                        />
                                    </ListItem>
                                </List>
                            ) : null}
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}

export default withStyles(styles)(ChannelHistoryItem)
