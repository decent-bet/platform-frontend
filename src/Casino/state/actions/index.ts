import actionsForChannel from './actionsForChannel'
import actionsForSlots from './actionsForSlots'
import actionsForChannelStatus from './actionsForChannelStatus'

const actions: any = {
  ...actionsForChannel.casino,
  ...actionsForSlots.casino,
  ...actionsForChannelStatus.casino
}

export default actions