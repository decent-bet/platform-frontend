import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        root: { paddingBottom: 50 },
        fab: { margin: theme.spacing.unit },
        extendedIcon: { margin: theme.spacing.unit },
        toolbar: {
            position: 'relative',
            top: 'auto',
            bottom: 0,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none'
        }
    })

export default styles
