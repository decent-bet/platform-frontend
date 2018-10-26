import ethUnits from 'ethereum-units'
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Button,
    TextField
} from '@material-ui/core'
import React, { Component } from 'react'

export default class StateChannelBuilder extends Component {
    state = {
        value: '100'
    }

    onValueChanged = event => this.setState({ value: event.target.value })

    commit = () => {
        // Do not Commit if value is invalid
        if (!this.isValueValid()) return

        const { onBuildChannelListener } = this.props
        const finalValue = ethUnits.convert(this.state.value, 'ether', 'wei')
        onBuildChannelListener(finalValue)
    }

    isValueValid = () => {
        const parsedValue = parseInt(this.state.value, 10)
        return parsedValue >= 100 && parsedValue <= 1000
    }

    onAcceptanceCheckedListener = () =>
        this.setState(oldState => ({
            acceptanceChecked: !oldState.acceptanceChecked
        }))

    render() {
        const currentValue = parseInt(this.state.value, 10) || ''
        const isValid = this.isValueValid() || currentValue === ''
        const errorText = isValid ? null : 'Between [100 and 1000]'
        return (
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
                        fullWidth
                    />
                </CardContent>
                <CardActions>
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={this.commit}
                        disabled={this.props.tokenBalance <= 0}
                    >
                        Play Slots
                    </Button>
                </CardActions>
            </Card>
        )
    }
}
