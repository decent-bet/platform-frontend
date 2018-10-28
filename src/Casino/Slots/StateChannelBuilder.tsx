import * as React from 'react'
import ethUnits from 'ethereum-units'
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Button,
    TextField
} from '@material-ui/core'
import { MIN_VTHO_AMOUNT } from 'src/constants'
import ConfirmationDialog from '../../common/components/ConfirmationDialog'

export interface IStateChannelBuilderState {
    dialogIsOpen: boolean
    value: string
}

export default class StateChannelBuilder extends React.Component<
    any,
    IStateChannelBuilderState
> {
    constructor(props) {
        super(props)
        this.state = {
            dialogIsOpen: false,
            value: '100'
        }
        this.onClickOk = this.onClickOk.bind(this)
        this.onCloseDialog = this.onCloseDialog.bind(this)
        this.onValueChanged = this.onValueChanged.bind(this)
        this.onClicPlay = this.onClicPlay.bind(this)
    }

    private onClickOk() {
        this.onCloseDialog()
    }

    private onCloseDialog() {
        this.setState({ dialogIsOpen: false })
    }

    private onValueChanged(event) {
        this.setState({ value: event.target.value })
    }

    private onClicPlay() {
        // Do not Commit if value is invalid
        if (!this.isValueValid()) return

        if (this.props.vthoBalance < MIN_VTHO_AMOUNT) {
            this.setState({ dialogIsOpen: true })
            return
        }

        const { onBuildChannelListener } = this.props
        const finalValue = ethUnits.convert(this.state.value, 'ether', 'wei')
        onBuildChannelListener(finalValue)
    }

    private isValueValid = () => {
        const parsedValue = parseInt(this.state.value, 10)
        return parsedValue >= 100 && parsedValue <= 1000
    }

    public render() {
        const currentValue = parseInt(this.state.value, 10) || ''
        const isValid = this.isValueValid() || currentValue === ''
        const errorText = isValid ? null : 'Between [100 and 1000]'
        return (
            <React.Fragment>
                <Card>
                    <CardHeader
                        title="Let's play Slots"
                        subheader="How many DBETs would you like?"
                    />
                    <CardContent>
                        <TextField
                            name="initial-deposit"
                            value={currentValue}
                            onChange={this.onValueChanged}
                            error={!isValid}
                            helperText={errorText}
                            fullWidth={true}
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.onClicPlay}
                            disabled={this.props.tokenBalance <= 0}
                        >
                            Play Slots
                        </Button>
                    </CardActions>
                </Card>
                <ConfirmationDialog
                    title="VTHO balance is too low"
                    content={`VTHO balance is too low to complete the transaction. Please ensure you have over 7500 VTHO to complete the transaction.`}
                    open={this.state.dialogIsOpen}
                    onClickOk={this.onClickOk}
                    onClose={this.onCloseDialog}
                />
            </React.Fragment>
        )
    }
}
