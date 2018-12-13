import Actions from './actions'
import { IThunkDependencies } from '../../../../common/types'

const actions: any = Actions.channelHistoryItem

export function getChannelDetails(channelId: string, address: string) {
    return async (
        dispatch,
        _getState,
        { contractFactory, utils }: IThunkDependencies
    ) => {
        dispatch(
            actions.getChannelDetails(
                contractFactory,
                utils,
                channelId,
                address
            )
        )
    }
}
