import * as React from 'react'
import { Button, ButtonBase, Typography } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InfoIcon from '@material-ui/icons/Info'
import ConfirmationDialog from '../../common/components/ConfirmationDialog'
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
            <React.Fragment>
                {this.props.accountHasAddress ? (
                    <CopyToClipboard
                        className="toolbar-button hidden-md-down"
                        text={this.props.address}
                        onCopy={this.props.onCopyAddress}
                    >
                        <ButtonBase component="button">
                            <Typography style={{ textTransform: 'none' }}>
                                Public Address: {this.props.address}
                            </Typography>
                        </ButtonBase>
                    </CopyToClipboard>
                ) : null}

                {this.props.isCasinoLogedIn ? (
                    <React.Fragment>
                        <Button variant="flat" className="toolbar-button">
                            Tokens: {tokenBalance.toFixed(2)} DBETs
                        </Button>
                        <Button
                            onClick={this.onClickOpenDialog}
                            variant="flat"
                            className="toolbar-button"
                        >
                            <InfoIcon style={{ marginRight: 3 }} /> Balance:{' '}
                            {vthoBalance.toFixed(5)} VTHO
                        </Button>
                        <ConfirmationDialog
                            title="Minimum VTHO balance"
                            content="The minimum VTHO balance to play slots is 7500. This is to ensure enough VTHO is present to cover transaction fees for closing a slots session."
                            open={this.state.dialogIsOpen}
                            onClickOk={this.onClickOk}
                            onClose={this.onCloseDialog}
                        />
                    </React.Fragment>
                ) : null}
            </React.Fragment>
        )
    }
}
