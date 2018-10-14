import * as React from 'react'
import Paper from '@material-ui/core/Paper'

export default function TransparentPaper(props: any) {
    return (
        <Paper
            style={{
                backgroundColor: 'transparent',
                boxShadow: 'none'
            }}
        >
            {props.children}
        </Paper>
    )
}
