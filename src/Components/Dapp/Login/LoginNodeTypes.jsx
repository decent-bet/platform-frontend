import React from 'react'
import { MenuItem, Select, FormControl, InputLabel } from '@material-ui/core'
import { PROVIDER_DBET, PROVIDER_LOCAL, PROVIDER_INFURA } from '../../Constants'

export default function LoginNodeTypes({
    provider,
    onProviderChangedListener
}) {
    return (
        <FormControl>
            <InputLabel>Connection:</InputLabel>
            <Select
                className="node-types"
                value={provider}
                onChange={onProviderChangedListener}
            >
                <MenuItem value={PROVIDER_DBET}>DBET Node</MenuItem>
                <MenuItem value={PROVIDER_LOCAL}>
                    Local Node
                </MenuItem>
                <MenuItem value={PROVIDER_INFURA}>Infura</MenuItem>
            </Select>
        </FormControl>
    )
}
