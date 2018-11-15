import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        datePickerDisabled: {
            '& > div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        },
        disableInputUnderline: {
            '& div div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        },
        input: {
            display: 'flex',
            padding: '0px 0 7px !important'
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center'
        },
        noOptionsMessage: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
        },
        singleValue: {
            fontSize: 16
        },
        placeholder: {
            position: 'absolute',
            left: 2,
            fontSize: 16
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing.unit,
            left: 0,
            right: 0
        },
        divider: {
            height: theme.spacing.unit * 2
        }
    })

export default styles
