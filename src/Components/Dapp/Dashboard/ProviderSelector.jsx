import React, { Component, Fragment } from 'react'
import {
    ListItemText,
    ListItem,
    SvgIcon,
    ListItemIcon,
    Collapse,
    List
} from '@material-ui/core'
import { stages } from '../../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProviderSelectorItem from './ProviderSelectorItem'

export default class ProviderSelector extends Component {
    state = {
        isOpen: false
    }

    onClickListener = () => this.setState({ isOpen: !this.state.isOpen })

    render() {
        const currentStage = stages.find((stage) => stage.key === this.props.currentStage) || { name: ''}
        const caretIcon = this.state.isOpen ? (
            <SvgIcon>
                <FontAwesomeIcon icon="caret-up" />
            </SvgIcon>
        ) : (
            <SvgIcon>
                <FontAwesomeIcon icon="caret-down" />
            </SvgIcon>
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
                            <FontAwesomeIcon icon="wrench" className="fa-fw" />
                        </SvgIcon>
                    </ListItemIcon>

                    <ListItemText inset={true}
                                  primary={`Connected to:`} 
                                  secondary={currentStage.name} 
                    />

                    {caretIcon}
                </ListItem>

                <Collapse in={this.state.isOpen} unmountOnExit>
                    <List component="div" disablePadding>
                    {
                    stages.map(stage => 
                        <ProviderSelectorItem
                            label={stage.name}
                            currentStage={this.props.currentStage}
                            stage={stage.key}
                            key={stage.key}
                            onStageChangeListener={
                                this.props.onStageChangeListener
                            }
                        />)
                     }
                    </List>
                </Collapse>
            </Fragment>
        )
    }
}
