import * as React from 'react'
import { connect } from 'react-redux'
import * as Thunks from '../thunks'
import { VIEW_LOGIN } from '../../shared/routes'
import CircularProgress from '@material-ui/core/CircularProgress'

function Logout(props) {
    
    props.dispatch(Thunks.logout())
         .then(()=>{
        window.location.href = VIEW_LOGIN
    })

    return (
        <CircularProgress/>
    )
    
}
export default connect((state: any) => state.auth)(Logout)