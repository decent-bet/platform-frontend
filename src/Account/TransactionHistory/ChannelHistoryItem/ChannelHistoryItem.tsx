import React, { Component, MouseEvent } from 'react'
import classnames from 'classnames'
import IChannelHistoryItemProps from './IChannelHistoryItemProps'
import {
    IChannelHistoryItemState,
    DefaultState
} from './ChannelHistoryItemState'
import {
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
    Divider,
    CircularProgress,
    Grid
} from '@material-ui/core'
import styles from './styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import { VEFORGE_URL } from '../../../config'
import EndSession from './EndSession'
import ClaimDebts from './ClaimDbets'

class ChannelHistoryItem extends Component<
    IChannelHistoryItemProps,
    IChannelHistoryItemState
> {
    public readonly state: IChannelHistoryItemState = DefaultState

    private didClickOnToogleExpand = async (_event: MouseEvent) => {
        const { expanded } = this.state
        this.setState({ expanded: !expanded })
        if (!expanded && this.props.details === null) {
            await this.props.getChannelDetails(
                this.props.channel.id,
                this.props.channel.initialDeposit,
                this.props.vetAddress
            )
        }
    }

    public render() {
        const { classes, channel, details } = this.props
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
                            <KeyboardArrowDownIcon />
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
                            {details ? (
                                <>
                                    <Divider />
                                    <EndSession
                                        details={details.finalize}
                                        url={VEFORGE_URL}
                                        linkButtonClass={classes.linkButton}
                                    />
                                    <Divider />
                                    <ClaimDebts
                                        details={details.claim}
                                        url={VEFORGE_URL}
                                        linkButtonClass={classes.linkButton}
                                    />
                                </>
                            ) : (
                                <Grid
                                    direction="row"
                                    container={true}
                                    alignItems="center"
                                    justify="center"
                                >
                                    <CircularProgress size={24} />
                                </Grid>
                            )}
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}

export default withStyles(styles)(ChannelHistoryItem)
