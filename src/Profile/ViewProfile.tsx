import * as React from 'react'
import { Grid } from '@material-ui/core'

class ViewProfile extends React.Component<any> {
    
    constructor(props) {
        super(props)
    }
    
    public render() {
        // const {profile} = this.props

        return (<Grid container={true}>
                    <Grid item={true}>
                        <p>tes</p>
                    </Grid>
                </Grid>)
    }
}

export default ViewProfile