import Actions from './actions'
import { IThunkDependencies } from '../../../common/types'

const actions: any = Actions.transactionHistory

export function getChannelsHistory(address: string, currentIndex: number) {
    return async (
        dispatch,
        _getState,
        { contractFactory, utils }: IThunkDependencies
    ) => {
        dispatch(
            actions.getChannelsHistory(
                contractFactory,
                utils,
                address,
                currentIndex
            )
        )
    }
}
