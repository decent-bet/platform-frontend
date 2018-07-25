import Reducer from './reducer'
import Actions from './actions'
import Helper from '../../Components/Helper'
import * as Thunks from './thunks'
import SlotsChannelHandler from './SlotsChannelHandler'

export {
    Actions,
    Reducer,
    Thunks,
    SlotsChannelHandler
}

const helper = new Helper()

// Watcher that monitors channel finalization
export function watcherChannelFinalized(id, dispatch) {
    const instance = helper.getContractHelper().SlotsChannelManager
    instance.logChannelFinalized(id)
    .on('data', (event) => {
        let _id = event.args.id.toString()
        dispatch(Actions.setChannelFinalized(_id))
    }).on('error', (error) => {
        console.error('Finalized channel event', error)
        return
    })
}

// Watcher that monitors the claiming of a channel's Chips
export function watcherChannelClaimed(id, dispatch) {
    const instance = helper.getContractHelper().SlotsChannelManager
    instance.logClaimChannelTokens(id)
    .on('data', (event) => {

        let _id = event.args.id.toString()
        let isHouse = event.args.isHouse
        dispatch(Actions.setChannelClaimed(_id, isHouse))
    })
    .on('error', (error) => {
        console.error('Claim channel tokens event error', error)
        return
    })
}
