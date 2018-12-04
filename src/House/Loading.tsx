import React, { FunctionComponent } from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    CircularProgress
} from '@material-ui/core'

const Loading: FunctionComponent<{}> = () => (
    <Card>
        <CardHeader title="Loading" />
        <CardContent>
            <CircularProgress />
        </CardContent>
    </Card>
)

export default Loading
