import Actions from './actions'
import { openAlert } from '../../common/state/thunks'
import { authWallet } from '../../Casino/state/thunks'
import {
    setAccountIsVerified,
    setAccountHasAddress
} from '../../Main/state/thunks'
const actions: any = Actions.account
import { IThunkDependencies } from '../../common/types'

export function saveAccountInfo(formData: any) {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        const result = await dispatch(
            actions.saveAccountInfo(keyHandler, formData)
        )
        dispatch(openAlert(result.value.message, 'success'))
        await dispatch(setAccountIsVerified())
    }
}

export function saveAccountAddress(
    account: any,
    publicAddress: string,
    privateKey: string
) {
    return async (
        dispatch,
        _getState,
        { keyHandler, thorifyFactory }: IThunkDependencies
    ) => {
        let thorify = thorifyFactory.make()
        const result = await dispatch(
            actions.saveAccountAddress(
                account,
                publicAddress,
                privateKey,
                keyHandler,
                thorify
            )
        )
        dispatch(openAlert(result.value.message, 'success'))
        const accountResult = await dispatch(setAccountHasAddress())
        await dispatch(authWallet(privateKey, accountResult.value)) // authenticate the user the first time
    }
}
