import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import { Grid, Card, CardHeader, IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Delete'
// import Alert from '../common/components/Alert'

class Profile extends React.Component<any> {
    
    constructor(props) {
        super(props)
    }
    
    public render() {
        // const {profile} = this.props
        return (<Grid container={true} direction="column">
            <Grid item={true}>
            <Card>
            <CardHeader
                 title="Public Address"
                 action={
                    <IconButton>
                      <EditIcon/>
                    </IconButton>
                  }
            />
            
        </Card>
            </Grid>
            <Grid item={true}>
            <Card>
            <CardHeader
                 title="Public Address"
                 action={
                    <IconButton>
                      <EditIcon/>
                    </IconButton>
                  }
            />
            
        </Card>
            </Grid>
        </Grid>)

        
    }
}

const mapStateToProps = state => Object.assign({}, state.profile, state.main)
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign(
        {},
        thunks
    ), dispatch)

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile)
export default ProfileContainer