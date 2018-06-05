import React from 'react'
import { MenuItem, Select } from '@material-ui/core'
import * as constants from '../../Constants'

export default function LoginNodeTypes({
    provider,
    onProviderChangedListener
}) {
    return (
        <Select
            className="node-types"
            floatingLabelText="Connection:"
            value={provider}
            onChange={onProviderChangedListener}
        >
            <MenuItem value={constants.PROVIDER_DBET} primaryText="DBET Node" />
            <MenuItem
                value={constants.PROVIDER_LOCAL}
                primaryText="Local Node"
            />
            <MenuItem value={constants.PROVIDER_INFURA} primaryText="Infura" />
        </Select>
    )
}
