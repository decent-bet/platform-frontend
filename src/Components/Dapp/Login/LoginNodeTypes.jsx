import React from 'react'
import { MenuItem, SelectField } from 'material-ui'

const constants = require('../../Constants')

export default function LoginNodeTypes({
    provider,
    onProviderChangedListener
}) {
    return (
        <SelectField
            className="node-types"
            floatingLabelText="Provider Node Type"
            value={provider}
            onChange={onProviderChangedListener}
        >
            <MenuItem value={constants.PROVIDER_DBET} primaryText="DBET Node" />
            <MenuItem
                value={constants.PROVIDER_LOCAL}
                primaryText="Local Node"
            />
            <MenuItem value={constants.PROVIDER_INFURA} primaryText="Infura" />
        </SelectField>
    )
}
