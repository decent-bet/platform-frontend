import React, { Component } from 'react'
import { ListItem, ListItemText } from '@material-ui/core'

export default class ProviderSelectorItem extends Component {
    onClickListener = () =>
        this.props.onStageChangeListener(this.props.stage)

    render() {
        return (
            <ListItem button selected={this.props.currentStage === this.props.stage} onClick={this.onClickListener}>
                <ListItemText inset primary={this.props.label} />
            </ListItem>
        )
    }
}
