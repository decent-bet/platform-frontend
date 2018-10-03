import * as React from 'react'
import classNames from 'classnames'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import IconButton from '@material-ui/core/IconButton'
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core'
import Slide from '@material-ui/core/Slide'

const getIconVariant = (variant): IconName => {
    switch (variant) {
        case 'success':
            return 'check-circle'
        case 'warning':
            return 'exclamation-triangle'
        case 'error':
            return 'exclamation'
        default:
            return 'info'
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
    const iconVariant = getIconVariant(variant)

    const handleClick = event => {
        if (onClose) {
            onClose(event, 'IconButton')
        }
    }

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <FontAwesomeIcon
                        icon={iconVariant}
                        className={classNames(
                            classes.icon,
                            classes.iconVariant
                        )}
                    />
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
                    <FontAwesomeIcon icon="times" className={classes.icon} />
                </IconButton>
            ]}
        />
    )
}

const AlertContentWrapper = withStyles(contentStyles)(AlertContent)

export default function Alert(props: IAlertProps) {
    const transition = props => (
        <Slide {...props} direction={props.transition || 'down'} />
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
