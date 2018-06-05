import ethUnits from 'ethereum-units'
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Checkbox,
    Button,
    TextField
} from '@material-ui/core'
import React, { Component } from 'react'

export default class StateChannelBuilder extends Component {
    state = {
        value: '100',
        acceptanceChecked: true
    }

    onValueChanged = (event, value) => this.setState({ value })

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
        const errorText =
            this.isValueValid() || this.state.value === ''
                ? null
                : 'Between [100 and 1000]'
        return (
            <Card className="card">
                <CardHeader
                    title="Let's play Slots"
                    subtitle="How many DBETs would you like?"
                />
                <CardContent>
                    <TextField
                        name="initial-deposit"
                        value={this.state.value}
                        onChange={this.onValueChanged}
                        fullWidth={true}
                        errorText={errorText}
                    />
                    <Checkbox
                        label="Use XX eth to cover session gas costs"
                        checked={this.state.acceptanceChecked}
                        onCheck={this.onAcceptanceCheckedListener}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        variant="raised"
                        primary={true}
                        onClick={this.commit}
                        disabled={!this.state.acceptanceChecked}
                    >
                        Play Slots
                    </Button>
                </CardActions>
            </Card>
        )
    }
}
