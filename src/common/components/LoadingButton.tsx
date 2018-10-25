import * as React from 'react'
import { CircularProgress, Button } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'

export interface ILoadingButtonProps extends ButtonProps {
    isLoading: boolean
}

export default function LoadingButton(props: ILoadingButtonProps) {
    let buttonProps = { ...props }
    const { isLoading } = buttonProps
    delete buttonProps.isLoading

    return (
        <Button {...buttonProps}>
            {isLoading === true ? (
                <CircularProgress
                    size={24}
                    color={props.color === 'primary' ? 'secondary' : 'primary'}
                />
            ) : (
                props.children || ''
            )}
        </Button>
    )
}
