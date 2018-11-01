import * as React from 'react'
import { Button, Typography, Grid, Slide } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InfoIcon from '@material-ui/icons/Info'
import MinVTHODialog from '../MinVTHODialog'
import { MIN_VTHO_AMOUNT } from '../../constants'
import TransparentPaper from '../../common/components/TransparentPaper'
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

    public componentDidMount() {
        setTimeout(() => {
            this.setState({ loaded: true })
        }, 500)
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

    private get isValidVthoBalance(): boolean {
        if (!this.props.vthoBalance) return true
        return this.props.vthoBalance > MIN_VTHO_AMOUNT
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
            <Slide direction="down" in={this.state.loaded} timeout={1000}>
                <TransparentPaper>
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
                                <Button variant="text">
                                    <Typography
                                        color="primary"
                                        component="span"
                                        style={{
                                            textTransform: 'none',
                                            paddingRight: '0.4em'
                                        }}
                                    >
                                        Public Address:
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
                                <Button variant="text">
                                    <Typography
                                        color="primary"
                                        component="span"
                                        style={{
                                            textTransform: 'none',
                                            paddingRight: '0.4em'
                                        }}
                                    >
                                        Tokens:
                                    </Typography>
                                    <Typography component="span">
                                        {tokenBalance.toFixed(2)} DBETs
                                    </Typography>
                                </Button>
                                <Button
                                    onClick={this.onClickOpenDialog}
                                    variant="text"
                                >
                                    <InfoIcon
                                        color={
                                            this.isValidVthoBalance
                                                ? 'primary'
                                                : 'error'
                                        }
                                        style={{ marginRight: 3 }}
                                    />

                                    <Typography
                                        color={
                                            this.isValidVthoBalance
                                                ? 'primary'
                                                : 'error'
                                        }
                                        component="span"
                                        style={{
                                            textTransform: 'none',
                                            paddingRight: '0.4em'
                                        }}
                                    >
                                        Balance:
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
                </TransparentPaper>
            </Slide>
        )
    }
}
