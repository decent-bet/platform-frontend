import React, { Component } from 'react'
import { Card, RaisedButton, CardActions, CardHeader } from 'material-ui'
import ethUnits from 'ethereum-units'

export default class StateChannelBuilder extends Component {
    on100DbetChannelClicked = () => {
        const { onBuildChannelListener } = this.props
        onBuildChannelListener(ethUnits.convert(100, 'ether', 'wei'))
    }

    on150DbetChannelClicked = () => {
        const { onBuildChannelListener } = this.props
        onBuildChannelListener(ethUnits.convert(150, 'ether', 'wei'))
    }

    render() {
        return (
            <section>
                <Card className="card">
                    <CardHeader
                        title="Create a new State Channel"
                        subtitle="How much you want to DBET?"
                    />
                    <CardActions>
                        <RaisedButton
                            primary={true}
                            label="100 DBET session"
                            onClick={this.on100DbetChannelClicked}
                        />
                        <RaisedButton
                            primary={true}
                            label="150 DBET session"
                            onClick={this.on150DbetChannelClicked}
                        />
                    </CardActions>
                </Card>
            </section>
        )
    }
}
