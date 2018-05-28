import React from 'react'
import { Dialog, FlatButton } from 'material-ui'

export default function ConfirmationDialog({
    title,
    onClick,
    open,
    onClose,
    message
}) {
    const actions = (
        <FlatButton label="Ok" primary={false} onTouchTap={onClick} />
    )
    return (
        <Dialog
            title={title}
            actions={actions}
            modal={false}
            open={open}
            autoScrollBodyContent={false}
            onRequestClose={onClose}
        >
            <p>{message}</p>
        </Dialog>
    )
}
