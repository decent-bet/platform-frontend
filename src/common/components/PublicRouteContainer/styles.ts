import { createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        root: { height: '100vh' },
        grid: {
            height: '100%',
            width: '38rem'
        },
        card: {
            width: '37rem',
            paddingBottom: '1em',
            paddingTop: '1em',
            marginTop: '1em',
            boxShadow:
                '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
        }
    })

export default styles
