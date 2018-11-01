import * as React from 'react'
import ConfirmationDialog from '../common/components/ConfirmationDialog'
import { MIN_VTHO_AMOUNT } from '../constants'

export default function MinVTHODialog({ open, onClickOk, onCloseDialog }) {
    return (
        <ConfirmationDialog
            title="Minimum VTHO balance"
            content={`The minimum VTHO balance to play slots is ${MIN_VTHO_AMOUNT}. This is to ensure enough VTHO is present to cover transaction fees for closing a slots session.`}
            open={open}
            onClickOk={onClickOk}
            onClose={onCloseDialog}
        />
    )
}
