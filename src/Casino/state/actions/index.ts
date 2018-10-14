import casino from './casino'
import slots from './slots'

const actions: any = {
    ...casino.casino,
    ...slots.casino
}

export default actions
