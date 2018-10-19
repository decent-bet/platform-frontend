import { createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        root: { height: '100vh' },
        grid: {
            width: '35rem',
            height: '100%'
        },
        card: {
            paddingBottom: '1em',
            paddingTop: '1em',
            marginTop: '1em',
            boxShadow:
                '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
        }
    })

export default styles
