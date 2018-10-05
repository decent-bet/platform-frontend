import Actions, { PREFIX } from './actionTypes'
import { FULFILLED } from 'redux-promise-middleware'

const DefaultState = {
    profileSaved: false
}

export default function reducer(
    state = DefaultState,
    action: any = { type: null }
) {
    switch (action.type) {
        case `${PREFIX}/${Actions.SAVE_USER_PROFILE}/${FULFILLED}`:
            return {
                profileSaved: true
            }
        default:
            return { ...state }
    }
}
