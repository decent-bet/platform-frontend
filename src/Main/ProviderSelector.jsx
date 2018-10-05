import React, { Component, Fragment } from 'react'
import {
    ListItemText,
    ListItem,
    ListItemIcon,
    Collapse,
    List
} from '@material-ui/core'
import { STAGES } from '../config'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import BuildIcon from '@material-ui/icons/Build'
import ProviderSelectorItem from './ProviderSelectorItem'

export default class ProviderSelector extends Component {
    state = {
        isOpen: false
    }

    onClickListener = () => this.setState({ isOpen: !this.state.isOpen })

    render() {
        const currentStage = STAGES.find(
            stage => stage.key === this.props.currentStage
        ) || { name: '' }
        const caretIcon = this.state.isOpen ? (
            <ArrowDropUpIcon/>
        ) : (
            <ArrowDropDownIcon/>
        )
        return (
            <Fragment>
                <ListItem
                    button
                    className="menu-item"
                    onClick={this.onClickListener}
                >
                    <ListItemIcon>
                        <SvgIcon>
                            <BuildIcon/>
                        </SvgIcon>
                    </ListItemIcon>

                    <ListItemText
                        inset={true}
                        primary={`Connected to:`}
                        secondary={currentStage.name}
                    />

                    {caretIcon}
                </ListItem>

                <Collapse in={this.state.isOpen} unmountOnExit>
                    <List component="div" disablePadding>
                        {STAGES.map(stage => (
                            <ProviderSelectorItem
                                label={stage.name}
                                currentStage={this.props.currentStage}
                                stage={stage.key}
                                key={stage.key}
                                onStageChangeListener={
                                    this.props.onStageChangeListener
                                }
                            />
                        ))}
                    </List>
                </Collapse>
            </Fragment>
        )
    }
}
