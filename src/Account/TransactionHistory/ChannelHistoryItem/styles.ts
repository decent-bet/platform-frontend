import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        linkButton: {
            textTransform: 'none',
            minHeight: 0,
            paddingBottom: 0,
            paddingTop: 0
        },
        card: {
            paddingRight: '1em',
            border: 'none',
            boxShadow: 'none',
            borderBottom: 'solid 1px rgba(255,255,255,0.5)',
            marginBottom: '0.5em',
            borderRadius: 0
        },
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest
            }),
            marginLeft: 'auto',
            [theme.breakpoints.up('sm')]: {
                marginRight: -8
            },
            float: 'right'
        },
        expandOpen: {
            transform: 'rotate(180deg)'
        }
    })

export default styles
