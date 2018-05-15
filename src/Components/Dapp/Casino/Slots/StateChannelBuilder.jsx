import React, { Component } from 'react'
import {
    Card,
    RaisedButton,
    CardActions,
    CardHeader,
    CardText,
    TextField
} from 'material-ui'
import ethUnits from 'ethereum-units'

export default class StateChannelBuilder extends Component {
    state = {
        value: ''
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

    render() {
        const errorText = this.isValueValid()
            ? null
            : 'Between [100 and 1000]'
        return (
            <Card className="card">
                <CardHeader
                    title="Let's play Slots"
                    subtitle="How many DBETs would you like?"
                />
                <CardText>
                    <TextField
                        name="initial-deposit"
                        value={this.state.value}
                        onChange={this.onValueChanged}
                        fullWidth={true}
                        errorText={errorText}
                    />
                </CardText>
                <CardActions>
                    <RaisedButton
                        primary={true}
                        label="Go!"
                        onClick={this.commit}
                    />
                </CardActions>
            </Card>
        )
    }
}
