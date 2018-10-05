import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import { Grid } from '@material-ui/core'
import ProfileAddress from './ProfileAddress'
import ProfileInfo from './ProfileInfo'
// import Alert from '../common/components/Alert'

class Profile extends React.Component<any> {
    constructor(props) {
        super(props)
    }

    public render() {
        const { profile } = this.props
        return (
            <Grid container={true} direction="column" spacing={40}>
                <Grid item={true} xs={12}>
                    <ProfileAddress profile={profile} />
                </Grid>
                <Grid item={true} xs={12}>
                    <ProfileInfo profile={profile} />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.profile, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const ProfileContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile)
export default ProfileContainer
