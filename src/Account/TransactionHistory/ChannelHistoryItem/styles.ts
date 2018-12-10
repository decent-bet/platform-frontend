import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        toolbar: {
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center'
        },
        itemCell: {
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '1em'
        },
        itemCellCreated: {
            float: 'left',
            display: 'flex',
            paddingRight: '0.5em',
            flexDirection: 'column',
            alignItems: 'center'
        },
        itemCellArrow: {
            float: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest
            }),
            marginLeft: 'auto',
            [theme.breakpoints.up('sm')]: {
                marginRight: -8
            }
        },
        expandOpen: {
            transform: 'rotate(180deg)'
        }
    })

export default styles
