import * as React from 'react'
import {
    Grid,
    Typography,
    ListItemText,
    Drawer,
    Divider,
    List,
    ListItem,
    IconButton
} from '@material-ui/core'
import AppDrawerItem from './AppDrawerItem'
import FaucetMenuItem from './FaucetMenuItem'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InfoIcon from '@material-ui/icons/Info'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import {
    VIEW_CASINO,
    VIEW_LOGOUT,
    VIEW_ACCOUNT,
    VIEW_ACCOUNT_NOTACTIVATED
} from '../../routes'
import { CURRENT_ENV, ENV_PRODUCTION, ENV_STAGING } from '../../constants'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset'
import dbetLogo from '../../assets/img/dbet-white.svg'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import IAppDrawerProps from './IAppDrawerProps'
import MinVTHODialog from '../MinVTHODialog'
import { IAppDrawerState, AppDrawerState } from './AppDrawerState'

class AppDrawer extends React.Component<IAppDrawerProps, IAppDrawerState> {
    constructor(props: IAppDrawerProps) {
        super(props)
        this.state = new AppDrawerState()
        this.onClickOpenDialog = this.onClickOpenDialog.bind(this)
        this.onClickOk = this.onClickOk.bind(this)
        this.onCloseDialog = this.onCloseDialog.bind(this)
        this.renderToolbarItems = this.renderToolbarItems.bind(this)
    }

    private onClickOpenDialog() {
        this.setState({ dialogIsOpen: true })
    }

    private onClickOk() {
        this.onCloseDialog()
    }

    private onCloseDialog() {
        this.setState({ dialogIsOpen: false })
    }

    private renderToolbarItems() {
        if (isWidthDown('sm', this.props.width)) {
            return (
                <React.Fragment>
                    {this.props.accountHasAddress ? (
                        <ListItem button={true}>
                            <CopyToClipboard
                                text={this.props.address}
                                onCopy={this.props.onCopyAddress}
                            >
                                <ListItemText
                                    primary={
                                        <Typography color="primary">
                                            Public Address:
                                            {'  '}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption">
                                            {this.props.address}
                                        </Typography>
                                    }
                                />
                            </CopyToClipboard>
                        </ListItem>
                    ) : null}

                    {this.props.isCasinoLogedIn ? (
                        <React.Fragment>
                            <ListItem button={true}>
                                <ListItemText
                                    primary={
                                        <Typography color="primary">
                                            DBETs:
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption">
                                            {this.props.tokenBalance.toFixed(2)}
                                        </Typography>
                                    }
                                />
                                <MinVTHODialog
                                    open={this.state.dialogIsOpen}
                                    onClickOk={this.onClickOk}
                                    onCloseDialog={this.onCloseDialog}
                                />
                            </ListItem>
                            <ListItem
                                button={true}
                                onClick={this.onClickOpenDialog}
                            >
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <Typography color="primary">
                                                <InfoIcon
                                                    style={{
                                                        marginRight: 3,
                                                        marginBottom: -5
                                                    }}
                                                />{' '}
                                                VTHO:
                                            </Typography>
                                        </React.Fragment>
                                    }
                                    secondary={
                                        <Typography variant="caption">
                                            {this.props.vthoBalance.toFixed(5)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                    ) : null}
                </React.Fragment>
            )
        }

        return null
    }

    public render() {
        return (
            <Drawer
                open={this.props.isDrawerOpen}
                onClose={this.props.onDrawerCloseListener}
            >
                <Grid
                    style={{
                        padding: '2em 1em 0 1em',
                        paddingBottom: isWidthUp('sm', this.props.width)
                            ? '2em'
                            : '1em'
                    }}
                    container={true}
                    direction="row"
                    alignItems="center"
                >
                    <Grid item={true} xs={10}>
                        <img
                            className="logo"
                            src={dbetLogo}
                            style={{
                                height: 26,
                                textAlign: 'left',
                                objectFit: 'contain'
                            }}
                            alt="Decent Bet Logo"
                        />
                    </Grid>
                    <Grid item={true} xs={2}>
                        <IconButton onClick={this.props.onDrawerCloseListener}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <List>
                    <AppDrawerItem
                        viewToSelect={VIEW_CASINO}
                        isSelected={this.props.selectedView.startsWith(
                            VIEW_CASINO
                        )}
                        onViewChangeListener={this.props.onViewChangeListener}
                        title="Casino"
                        icon={<VideogameAssetIcon />}
                    />

                    <AppDrawerItem
                        viewToSelect={VIEW_ACCOUNT}
                        isSelected={
                            this.props.selectedView === VIEW_ACCOUNT ||
                            this.props.selectedView ===
                                VIEW_ACCOUNT_NOTACTIVATED
                        }
                        onViewChangeListener={this.props.onViewChangeListener}
                        title="Account"
                        icon={<AccountCircleIcon />}
                    />
                    {CURRENT_ENV !== ENV_PRODUCTION &&
                    CURRENT_ENV !== ENV_STAGING ? (
                        <FaucetMenuItem
                            onFaucetClickedListener={
                                this.props.onFaucetClickedListener
                            }
                        />
                    ) : null}

                    <AppDrawerItem
                        viewToSelect={VIEW_LOGOUT}
                        isSelected={false}
                        onViewChangeListener={this.props.onViewChangeListener}
                        title="Logout"
                        icon={<ExitToAppIcon />}
                    />

                    <Divider />
                    {this.renderToolbarItems()}
                </List>
            </Drawer>
        )
    }
}
export default withWidth()(AppDrawer)
