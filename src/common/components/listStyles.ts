import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        card: {
            marginTop: '80px',
            marginBottom: '80px',
            paddingRight: '1.1em',
            paddingTop: '1.2em'
        },
        olist: {
            '& ol[type="1"]': {
                fontSize: '1.1em',
                fontWeight: 'lighter',
                lineHeight: '1.6em',
                counterReset: 'item',
                '& > li': {
                    paddingBottom: '1.5em',
                    display: 'inline-block'
                },
                '& > li:before': {
                    content: `counters(item, ".") ". "`,
                    counterIncrement: 'item',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                }
            }
        },
        ulist: {
            '& ul': {
                fontSize: '1.1em',
                fontWeight: 'lighter',
                lineHeight: '1.6em',
                listStyle: 'none',
                '& li': {
                    paddingBottom: '1.5em'
                }
            }
        }
    })
export default styles
