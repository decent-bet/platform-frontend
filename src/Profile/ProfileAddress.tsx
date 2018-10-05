import * as React from 'react'
import {
    Grid,
    Card,
    CardHeader,
    IconButton,
    CardContent
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'

interface IProfileAddressState {
    editing: boolean
}

class ProfileAddress extends React.Component<any, IProfileAddressState> {

    constructor(props) {
        super(props)
        
        this.state = {
            editing: false
        }
    }

    public render() {
        // const {profile} = this.props
        return (
            <Card>
                <CardHeader
                    title="Public Address"
                    action={
                        <IconButton>
                            {this.state.editing ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    }
                />
                <CardContent>
                    <Grid container={true}>
                        <Grid item={true}>
                            <p>Address</p>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default ProfileAddress
