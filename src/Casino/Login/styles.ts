import { createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        root: {
            zIndex: 1
        },
        content: {
            padding: '1em'
        },
        actions: {
            paddingBottom: '0.5em'
        },
        avatar: {
            margin: 10,
            width: 80,
            height: 80
        },
        title: {},
        contentText: {
            paddingBottom: '1.2em'
        }
    })
export default styles
