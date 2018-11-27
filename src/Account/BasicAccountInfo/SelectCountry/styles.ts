import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        disableInputUnderline: {
            '& div div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        }
    })

export default styles
