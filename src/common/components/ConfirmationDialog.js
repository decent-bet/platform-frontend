import React from 'react'
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContentText,
    DialogContent
} from '@material-ui/core'

export default function ConfirmationDialog({
    title,
    onClick,
    open,
    onClose,
    message
}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="flat" color="primary" onClick={onClick}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}
