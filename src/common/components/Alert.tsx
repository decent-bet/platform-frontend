import * as React from 'react'
import classNames from 'classnames'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import IconButton from '@material-ui/core/IconButton'
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core'
import Slide from '@material-ui/core/Slide'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'

const getIconVariant = (variant, varianClassName) => {
    switch (variant) {
        case 'success':
            return <CheckCircleIcon className={varianClassName} />
        case 'warning':
            return <WarningIcon className={varianClassName} />
        case 'error':
            return <ErrorIcon className={varianClassName} />
        default:
            return <InfoIcon className={varianClassName} />
    }
}

const contentStyles = (theme: Theme) =>
    createStyles({
        success: {
            backgroundColor: green[600],
            opacity: 0.8
        },
        error: {
            backgroundColor: theme.palette.error.dark,
            opacity: 0.8
        },
        info: {
            backgroundColor: theme.palette.primary.dark,
            opacity: 0.8
        },
        warning: {
            backgroundColor: amber[700],
            opacity: 0.8
        },
        icon: {
            fontSize: 20
        },
        iconVariant: {
            opacity: 0.9,
            marginRight: theme.spacing.unit
        },
        message: {
            display: 'flex',
            alignItems: 'center',
            color: '#ffffff'
        },
        close: {
            color: '#ffffff'
        }
    })

export type AlertVariant = 'success' | 'warning' | 'error' | 'info'

export interface IAlertContentProps extends WithStyles<typeof contentStyles> {
    className?: string
    message: React.ReactNode | string
    onClose?: (event: React.SyntheticEvent<any>, reason: string) => void
    variant: AlertVariant
}

export interface IAlertProps extends SnackbarProps {
    variant: AlertVariant
    transition?: string | undefined | null
}

function AlertContent(props: IAlertContentProps) {
    const { classes, className, message, onClose, variant } = props
    const variantClassName = classNames(classes.icon, classes.iconVariant)
    const iconVariant = getIconVariant(variant, variantClassName)
    const contentClassName = classNames(classes[variant], className)

    const handleClick = event => {
        if (onClose) {
            onClose(event, 'IconButton')
        }
    }

    return (
        <SnackbarContent
            className={contentClassName}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    {iconVariant}
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={handleClick}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>
            ]}
        />
    )
}

const AlertContentWrapper = withStyles(contentStyles)(AlertContent)

export default function Alert(props: IAlertProps) {
    const transition = props => (
        <Slide {...props} direction={props.transition || 'up'} />
    )
    let { autoHideDuration } = props
    if (!autoHideDuration) {
        autoHideDuration = 6000
    }
    return (
        <Snackbar
            TransitionComponent={transition}
            anchorOrigin={props.anchorOrigin}
            open={props.open}
            autoHideDuration={autoHideDuration}
            onClose={props.onClose}
        >
            <AlertContentWrapper
                variant={props.variant}
                message={props.message}
                onClose={props.onClose}
            />
        </Snackbar>
    )
}
