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

const listeners = []

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

export function initWatchers(dispatch) {
    const channelManager = helper.getContractHelper().SlotsChannelManager

    // Gets all the channels for the current user
    const channelListener = channelManager
        .logNewChannel()
        .watch((err, event) => {
            const channelId = event.args.id
            dispatch(Actions.getChannelDetails(channelId))
            dispatch(Actions.getLastSpin(channelId))
        })

    // Listen for Token deposits into Chips
    const depositListener = channelManager.logDeposit().watch((err, event) => {
        if (err) {
            console.log('Deposit event error', err)
            return
        }
        dispatch(Actions.getBalance())
    })

    // Listen for Chip withdrawal into Tokens
    const withdrawListener = channelManager
        .logWithdraw()
        .watch((err, event) => {
            if (err) {
                console.log('Withdraw event error', err)
                return
            }
            dispatch(Actions.getBalance())
        })

    listeners.push(depositListener, withdrawListener, channelListener)
}

export function stopWatchers(dispatch) {
    try {
        for (const listener of listeners) {
            listener.requestManager.stopPolling()
        }
    } catch (error) {}
}
