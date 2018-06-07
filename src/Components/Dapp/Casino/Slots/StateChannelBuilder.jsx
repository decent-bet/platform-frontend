import ethUnits from 'ethereum-units'
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Checkbox,
    Button,
    TextField,
    FormControlLabel
} from '@material-ui/core'
import React, { Component } from 'react'

export default class StateChannelBuilder extends Component {
    state = {
        value: '100',
        acceptanceChecked: true
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
            <Card className="card">
                <CardHeader
                    title="Let's play Slots"
                    subtitle="How many DBETs would you like?"
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={this.state.acceptanceChecked}
                                onChange={this.onAcceptanceCheckedListener}
                            />
                        }
                        label="Use XX eth to cover session gas costs"
                    />
                </CardContent>
                <CardActions>
                    <Button
                        variant="raised"
                        color="primary"
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
