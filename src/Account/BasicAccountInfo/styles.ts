import { createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        datePickerDisabled: {
            '& > div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        }
    })

export default styles
