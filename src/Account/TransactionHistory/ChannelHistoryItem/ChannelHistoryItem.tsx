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
// import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
// import SaveAltRoundedIcon from '@material-ui/icons/SaveAltRounded'
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
                        <>
                            <Typography color="secondary" variant="body2">
                                Created: {` ${channel.timestamp}`}
                            </Typography>
                            <Typography variant="body2">
                                Nonce: {` ${channel.channelNonce}`}
                            </Typography>
                        </>
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
                        <List disablePadding={true} component="nav">
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
                                                        channel.transactionHash
                                                    }`}
                                                >
                                                    {channel.transactionHash}
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
                                        secondary={`Created at: ${
                                            channel.timestamp
                                        }`}
                                    />
                                </ListItem>
                            </List>
                            <Divider />
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}

export default withStyles(styles)(ChannelHistoryItem)
