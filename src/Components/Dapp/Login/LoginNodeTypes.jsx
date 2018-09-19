import React from 'react'
import { MenuItem, Select, FormControl, InputLabel } from '@material-ui/core'
import { stages } from '../../../config'

export default function LoginNodeTypes({
    currentStage,
    onStageChangeListener
}) {
    
    return (
        <FormControl>
            <InputLabel>Connection:</InputLabel>
            <Select
                className="node-types"
                value={currentStage}
                onChange={onStageChangeListener}
            >
            {
                stages.map(stage => <MenuItem key={stage.key} value={stage.key}>{stage.name}</MenuItem>)
            }
            </Select>
        </FormControl>
    )
}
