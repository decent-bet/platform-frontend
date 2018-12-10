import React, { Component, MouseEvent } from 'react'
import classnames from 'classnames'
import IChannelHistoryItemProps from './IChannelHistoryItemProps'
import {
    IChannelHistoryItemState,
    DefaultState
} from './ChannelHistoryItemState'
import {
    Grid,
    IconButton,
    Typography,
    Table,
    Collapse,
    TableBody,
    TableCell,
    TableRow,
    Toolbar,
    withStyles
} from '@material-ui/core'
import styles from './styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import SaveAltRoundedIcon from '@material-ui/icons/SaveAltRounded'
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
            <TableRow hover={false} key={channel.id}>
                <TableCell>
                    <Toolbar className={classes.toolbar}>
                        <Grid
                            container={true}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item={true}>
                                <Typography color="primary" variant="body2">
                                    Channel ID: {channel.id}
                                </Typography>
                                <Typography variant="body2">
                                    Nonce: {channel.channelNonce}
                                </Typography>
                            </Grid>
                            <Grid item={true}>
                                <IconButton
                                    className={classnames(classes.expand, {
                                        [classes.expandOpen]: this.state
                                            .expanded
                                    })}
                                    onClick={this.didClickOnToogleExpand}
                                >
                                    {<KeyboardArrowDownIcon />}
                                </IconButton>
                                <Typography
                                    className={classes.itemCellCreated}
                                    component="span"
                                    color="secondary"
                                    variant="body2"
                                >
                                    Created: {channel.createTime}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Toolbar>
                    <Collapse
                        in={this.state.expanded}
                        timeout="auto"
                        unmountOnExit={true}
                    >
                        <Table>
                            <TableBody>
                                <TableRow hover={false}>
                                    <TableCell className={classes.itemCell}>
                                        <CheckCircleRoundedIcon color="primary" />{' '}
                                        <Typography>Start session</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow hover={false}>
                                    <TableCell className={classes.itemCell}>
                                        <ExitToAppRoundedIcon color="primary" />{' '}
                                        <Typography>End session</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow hover={false}>
                                    <TableCell className={classes.itemCell}>
                                        <SaveAltRoundedIcon color="primary" />{' '}
                                        <Typography>Claim DBET's</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        )
    }
}

export default withStyles(styles)(ChannelHistoryItem)
