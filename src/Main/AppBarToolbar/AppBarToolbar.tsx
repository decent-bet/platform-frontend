import * as React from 'react'
import { Button, Typography, Grid } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InfoIcon from '@material-ui/icons/Info'
import MinVTHODialog from '../MinVTHODialog'
import IAppBarToolbarProps from './IAppBarToolbarProps'
import { IAppBarToolbarState, AppBarToolbarState } from './AppBarToolbarState'

export default class AppBarToolbar extends React.Component<
    IAppBarToolbarProps,
    IAppBarToolbarState
> {
    constructor(props: IAppBarToolbarProps) {
        super(props)
        this.state = new AppBarToolbarState()
        this.onClickOk = this.onClickOk.bind(this)
        this.onCloseDialog = this.onCloseDialog.bind(this)
        this.onClickOpenDialog = this.onClickOpenDialog.bind(this)
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

    public render() {
        let { vthoBalance, tokenBalance } = this.props
        // Null protection
        if (!vthoBalance) {
            vthoBalance = 0
        }

        if (!tokenBalance) {
            tokenBalance = 0
        }

        return (
            <Grid
                container={true}
                direction="row"
                justify="flex-end"
                alignItems="center"
            >
                {this.props.accountHasAddress ? (
                    <CopyToClipboard
                        text={this.props.address}
                        onCopy={this.props.onCopyAddress}
                    >
                        <Button variant="flat">
                            <Typography
                                color="primary"
                                component="span"
                                style={{ textTransform: 'none' }}
                            >
                                Public Address:
                                {'  '}
                            </Typography>
                            <Typography
                                component="span"
                                style={{ textTransform: 'none' }}
                            >
                                {this.props.address}
                            </Typography>
                        </Button>
                    </CopyToClipboard>
                ) : null}

                {this.props.isCasinoLogedIn ? (
                    <React.Fragment>
                        <Button variant="flat">
                            <Typography
                                color="primary"
                                component="span"
                                style={{ textTransform: 'none' }}
                            >
                                Tokens:
                                {'  '}
                            </Typography>
                            <Typography component="span">
                                {tokenBalance.toFixed(2)} DBETs
                            </Typography>
                        </Button>
                        <Button onClick={this.onClickOpenDialog} variant="flat">
                            <InfoIcon
                                color="primary"
                                style={{ marginRight: 3 }}
                            />
                            <Typography
                                color="primary"
                                component="span"
                                style={{ textTransform: 'none' }}
                            >
                                Balance:
                                {'  '}
                            </Typography>
                            <Typography component="span">
                                {vthoBalance.toFixed(5)} VTHO
                            </Typography>
                        </Button>
                        <MinVTHODialog
                            open={this.state.dialogIsOpen}
                            onClickOk={this.onClickOk}
                            onCloseDialog={this.onCloseDialog}
                        />
                    </React.Fragment>
                ) : null}
            </Grid>
        )
    }
}
