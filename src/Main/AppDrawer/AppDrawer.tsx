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
import Routes from '../../routes'
import { CURRENT_ENV, ENV_LOCAL, APP_VERSION } from '../../constants'
import {
    AccountCircle,
    ExitToApp,
    VideogameAsset,
    Info,
    ChevronLeft
} from '@material-ui/icons'
import dbetLogo from '../../assets/img/dbet-white.svg'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import IAppDrawerProps from './IAppDrawerProps'
import MinVTHODialog from '../MinVTHODialog'
import IAppDrawerState from './IAppDrawerState'

class AppDrawer extends React.Component<IAppDrawerProps, IAppDrawerState> {
    public state = { dialogIsOpen: false }

    constructor(props: IAppDrawerProps) {
        super(props)
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
                                                <Info
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
                            <ChevronLeft />
                        </IconButton>
                    </Grid>
                </Grid>
                <List>
                    <AppDrawerItem
                        viewToSelect={Routes.Casino}
                        isSelected={this.props.selectedView.startsWith(
                            Routes.Casino
                        )}
                        onViewChangeListener={this.props.onViewChangeListener}
                        title="Casino"
                        icon={<VideogameAsset />}
                    />

                    <AppDrawerItem
                        viewToSelect={Routes.Account}
                        isSelected={
                            this.props.selectedView === Routes.Account ||
                            this.props.selectedView ===
                                Routes.AccountNotActivated
                        }
                        onViewChangeListener={this.props.onViewChangeListener}
                        title="Account"
                        icon={<AccountCircle />}
                    />
                    {CURRENT_ENV === ENV_LOCAL ? (
                        <FaucetMenuItem
                            onFaucetClickedListener={
                                this.props.onFaucetClickedListener
                            }
                        />
                    ) : null}

                    <AppDrawerItem
                        viewToSelect={Routes.Logout}
                        isSelected={false}
                        onViewChangeListener={this.props.onViewChangeListener}
                        title="Logout"
                        icon={<ExitToApp />}
                    />

                    <Divider />
                    {this.renderToolbarItems()}

                    {APP_VERSION && APP_VERSION.length > 0 ? (
                        <React.Fragment>
                            <Divider />
                            <ListItem button={false}>
                                <ListItemText
                                    primary={
                                        <Typography color="primary">
                                            Version:
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption">
                                            {APP_VERSION}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                    ) : null}
                </List>
            </Drawer>
        )
    }
}
export default withWidth()(AppDrawer)
