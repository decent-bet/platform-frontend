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
            alignItems: 'center'
        },
        itemCellCreated: {
            float: 'left'
        },
        itemCellArrow: {
            float: 'right'
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
