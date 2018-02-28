import React, { Fragment } from 'react'
import { TextField } from 'material-ui'

export default function LoginField({
    hintText,
    value,
    onChange,
    onLoginKeypress
}) {
    return (
        <Fragment>
            <TextField
                type="text"
                fullWidth={true}
                multiLine={true}
                floatingLabelText={hintText}
                value={value}
                onChange={onChange}
                onKeyPress={onLoginKeypress}
            />
        </Fragment>
    )
}
