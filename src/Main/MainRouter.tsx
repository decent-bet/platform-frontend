import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Game from '../Game'
import Slots from '../Slots'
import Profile from '../Profile'
import { VIEW_SLOTS, VIEW_SLOTS_GAME, VIEW_PROFILE, VIEW_MAIN } from '../routes'

const MainRouter = ({...rest}) => {
    const {profile} = rest 
    
    const defaultView = (profile && 
                        profile.basicVerification && 
                        (profile.basicVerification.verified && 
                        profile.basicVerification.verified === true)) ?  VIEW_SLOTS : VIEW_PROFILE
    const profileView = (props) => {
        return <Profile {...props} {...rest}/>
    }

    return (
    <Switch>
        <Redirect exact={true} from={VIEW_MAIN} to={defaultView} />
        <Route path={VIEW_SLOTS} component={Slots} />
        <Route path={VIEW_SLOTS_GAME} component={Game} />
        <Route path={VIEW_PROFILE} render={profileView}/>
        <Redirect exact={true} from="*" to={VIEW_MAIN} />
    </Switch>
)
}

export default MainRouter
