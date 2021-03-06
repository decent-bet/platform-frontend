import { Middleware, MiddlewareAPI, Dispatch, Action } from 'redux'
import appActions from '../state/actions'

const actions: any = appActions.app
export const RejectionCatcherMiddleware: Middleware = (api: MiddlewareAPI) => (
    next: Dispatch
) => (action: Action<any>) => {
    const actionType: string = action.type

    if (actionType.endsWith('/REJECTED')) {
        const { payload } = action as any
        if (payload) {
            if (payload.statusCode) {
                api.dispatch(actions.showChannelsBackendError(payload))
            } else {
                api.dispatch(
                    actions.openAlert(
                        payload.message ||
                            'Uncategorized error, please inform to support@decent.bet.',
                        payload.variant
                    )
                )
            }
        }
    }

    return next(action)
}
