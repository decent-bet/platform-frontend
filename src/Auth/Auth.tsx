import * as React from 'react'
import PublicRouteContainer from '../common/components/PublicRouteContainer'
import AuthRouter from './AuthRouter'

export default function Auth() {
    return (
        <PublicRouteContainer>
            <AuthRouter />
        </PublicRouteContainer>
    )
}
