import { connect } from 'react-redux'
import { Thunks } from '../../../Model/auth'
import { VIEW_LOGIN } from '../../Constants'

function LogoutRoute(props) {
    props.dispatch(Thunks.logout()).then(()=>{
        location.href = VIEW_LOGIN
        return null
    })
}
// Connect this component to Redux
export default connect(state => state.auth)(LogoutRoute)