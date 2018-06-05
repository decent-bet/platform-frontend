import React from 'react'
import { Dialog, Button } from '@material-ui/core'

export default function ConfirmationDialog({
    title,
    onClick,
    open,
    onClose,
    message
}) {
    const actions = (
        <Button
            variant="flat"
            primary={false}
            onTouchTap={onClick}
        >
        OK
        </Button>
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
