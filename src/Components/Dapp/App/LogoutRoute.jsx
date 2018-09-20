import React from 'react'
import { connect } from 'react-redux'
import { Thunks } from '../../../Model/auth'
import { VIEW_LOGIN } from '../../Constants'
import {CircularProgress } from '@material-ui/core'
function LogoutRoute(props) {
    
    props.dispatch(Thunks.logout()).then(()=>{
        window.location.href = VIEW_LOGIN
    })

    return (
        <CircularProgress></CircularProgress>
    )
    
}
// Connect this component to Redux
export default connect(state => state.auth)(LogoutRoute)