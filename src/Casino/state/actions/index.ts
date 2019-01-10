import casino from './casino'
import slots from './slots'
import house from './house'

const actions: any = {
    ...house.casino,
    ...casino.casino,
    ...slots.casino
}

export default actions
