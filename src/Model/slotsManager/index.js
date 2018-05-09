import actionsForChannel from './actionsForChannel'
import actionsForSlots from './actionsForSlots'
import actionsForChannelStatus from './actionsForChannelStatus'
import reducer from './reducer'
import Helper from '../../Components/Helper'
import slotsChannelHandler from './SlotsChannelHandler'

const helper = new Helper()

export const Actions = {
    ...actionsForChannel.slotManager,
    ...actionsForSlots.slotManager,
    ...actionsForChannelStatus.slotManager
}
export const Reducer = reducer
export const SlotsChannelHandler = slotsChannelHandler

// Watcher that monitors channel finalization
export function watcherChannelFinalized(id, dispatch) {
    const instance = helper.getContractHelper().SlotsChannelManager
    instance.logChannelFinalized(id).watch((err, event) => {
        if (err) {
            console.log('Finalized channel event error', err)
            return
        }
        let _id = event.args.id.toString()
        dispatch(Actions.setChannelFinalized(_id))
    })
}

// Watcher that monitors the claiming of a channel's Chips
export function watcherChannelClaimed(id, dispatch) {
    const instance = helper.getContractHelper().SlotsChannelManager
    instance.logClaimChannelTokens(id).watch((err, event) => {
        if (err) {
            console.log('Claim channel tokens event error', err)
            return
        }

        let _id = event.args.id.toString()
        let isHouse = event.args.isHouse
        dispatch(Actions.setChannelClaimed(_id, isHouse))
    })
}
