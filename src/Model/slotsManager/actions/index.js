import actionsForChannel from './actionsForChannel'
import actionsForSlots from './actionsForSlots'
import actionsForChannelStatus from './actionsForChannelStatus'

export default {
  ...actionsForChannel.slotManager,
  ...actionsForSlots.slotManager,
  ...actionsForChannelStatus.slotManager
}