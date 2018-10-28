import { createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        root: { height: '100vh' },
        grid: {
            height: '90%',
            width: '100%'
        },
        card: {
            width: '100%',
            padding: '1em',
            marginTop: '1em',
            boxShadow:
                '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
        }
    })

export default styles
