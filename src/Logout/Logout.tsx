import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import { logout } from '../common/state/thunks'
import { VIEW_LOGIN } from '../routes'


function Logout(props) {
    
    props.dispatch(logout())
         .then(()=>{
        window.location.href = VIEW_LOGIN
    })

    return (
        <CircularProgress/>
    )
    
}
export default connect((state: any) => state.main)(Logout)