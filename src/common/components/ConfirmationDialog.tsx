import * as React from 'react'
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
    content,
    open,
    onClickOk,
    onClose
}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" onClick={onClickOk}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}
