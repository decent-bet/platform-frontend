import React from 'react'
import { MenuItem, Select, FormControl, InputLabel } from '@material-ui/core'
import * as constants from '../../Constants'

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
                <MenuItem value={constants.PROVIDER_DBET}>DBET Node</MenuItem>
                <MenuItem value={constants.PROVIDER_LOCAL}>
                    Local Node
                </MenuItem>
                <MenuItem value={constants.PROVIDER_INFURA}>Infura</MenuItem>
            </Select>
        </FormControl>
    )
}
