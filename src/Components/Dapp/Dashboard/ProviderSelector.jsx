import React, { Component, Fragment } from 'react'
import {
    ListItemText,
    ListItem,
    SvgIcon,
    ListItemIcon,
    Collapse,
    List
} from '@material-ui/core'
import * as constants from '../../Constants'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import ProviderSelectorItem from './ProviderSelectorItem'

export default class ProviderSelector extends Component {
    state = {
        isOpen: false
    }

    onClickListener = () => this.setState({ isOpen: !this.state.isOpen })

    render() {
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

                    <ListItemText primary="Connected to:" />

                    {caretIcon}
                </ListItem>

                <Collapse in={this.state.isOpen} unmountOnExit>
                    <List component="div" disablePadding>
                        <ProviderSelectorItem
                            label="DBET Node"
                            selectedProvider={this.props.gethNodeProvider}
                            providerUrl={constants.PROVIDER_DBET}
                            onProviderChangeListener={
                                this.props.onProviderChangeListener
                            }
                        />

                        <ProviderSelectorItem
                            label="Local Node"
                            providerUrl={constants.PROVIDER_LOCAL}
                            selectedProvider={this.props.gethNodeProvider}
                            onProviderChangeListener={
                                this.props.onProviderChangeListener
                            }
                        />

                        <ProviderSelectorItem
                            label="Infura"
                            providerUrl={constants.PROVIDER_INFURA}
                            selectedProvider={this.props.gethNodeProvider}
                            onProviderChangeListener={
                                this.props.onProviderChangeListener
                            }
                        />
                    </List>
                </Collapse>
            </Fragment>
        )
    }
}
