import actionsForChannel from './actionsForChannel'
import actionsForSlots from './actionsForSlots'
import reducer from './reducer'
import Helper from '../../Components/Helper'
import { CHANNEL_STATUS_WAITING } from '../../Components/Constants'
import slotsChannelHandler from './SlotsChannelHandler'

const helper = new Helper()

export const Actions = {
    ...actionsForChannel.slotManager,
    ...actionsForSlots.slotManager
}
export const Reducer = reducer
export const SlotsChannelHandler = slotsChannelHandler

let currentSessionsBeingWatched = []

// Watcher for deposits to a channel
function watcherChannelDeposit(id, dispatch) {
    helper
        .getContractHelper()
        .getWrappers()
        .slotsChannelManager()
        .logChannelDeposit(id)
        .watch((err, event) => {
            if (err) {
                console.log('Deposit channel event error', err)
                return
            }
            let _id = event.args.id.toString()
            dispatch(Actions.setChannelDeposited(_id))
        })
}

// Watcher that monitors channel activation
function watcherChannelActivate(id, dispatch) {
    helper
        .getContractHelper()
        .getWrappers()
        .slotsChannelManager()
        .logChannelActivate(id)
        .watch((err, event) => {
            if (err) {
                console.log('Activate channel event error', err)
                return
            }
            let _id = event.args.id.toString()
            dispatch(Actions.setChannelActivated(_id))
        })
}

// Watcher that monitors channel finalization
function watcherChannelFinalized(id, dispatch) {
    helper
        .getContractHelper()
        .getWrappers()
        .slotsChannelManager()
        .logChannelFinalized(id)
        .watch((err, event) => {
            if (err) {
                console.log('Finalized channel event error', err)
                return
            }
            let _id = event.args.id.toString()
            dispatch(Actions.setChannelFinalized(_id))
        })
}

// Watcher that monitors the claiming of a channel's Chips
function watcherChannelClaimed(id, dispatch) {
    helper
        .getContractHelper()
        .getWrappers()
        .slotsChannelManager()
        .logClaimChannelTokens(id)
        .watch((err, event) => {
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
    let channelManager = helper
        .getContractHelper()
        .getWrappers()
        .slotsChannelManager()

    // Watch for new channels being opened
    channelManager.logNewChannel().watch((err, event) => {
        if (err) {
            console.log('New channel event error', err)
            return
        }

        let id = event.args.id.toNumber()
        let newChannel = {
            id,
            status: CHANNEL_STATUS_WAITING,
            initialDeposit: event.args.initialDeposit.toFixed()
        }

        dispatch(Actions.setChannel(newChannel))

        currentSessionsBeingWatched.push(id)

        watcherChannelDeposit(id, dispatch)
        watcherChannelActivate(id, dispatch)
        watcherChannelFinalized(id, dispatch)
        watcherChannelClaimed(id, dispatch)
    })

    // Listen for Token deposits into Chips
    channelManager.logDeposit().watch((err, event) => {
        if (err) {
            console.log('Deposit event error', err)
            return
        }
        dispatch(Actions.getBalance())
    })

    // Listen for Chip withdrawal into Tokens
    channelManager.logWithdraw().watch((err, event) => {
        if (err) {
            console.log('Withdraw event error', err)
            return
        }
        dispatch(Actions.getBalance())
    })
}

export function stopWatchers(dispatch) {
    // TODO: Web3 as of 1.beta33 has these functions broken
    try {
        let channelManager = helper
            .getContractHelper()
            .getWrappers()
            .slotsChannelManager()

        channelManager.logNewChannel().stopWatching()
        channelManager.logDeposit().stopWatching()
        channelManager.logWithdraw().stopWatching()

        for (const id of currentSessionsBeingWatched) {
            channelManager.logChannelDeposit(id).stopWatching()
            channelManager.logChannelActivate(id).stopWatching()
            channelManager.logChannelFinalized(id).stopWatching()
            channelManager.logClaimChannelTokens(id).stopWatching()
        }
        currentSessionsBeingWatched = []
    } catch (error) {
        console.warn('Web3 1.0.0 cannot unsubscribe')
    }
}
