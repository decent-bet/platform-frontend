import IKeyHandler from './IKeyHandler'
import IContractFactory from './IContractFactory'
import IThorifyFactory from './IThorifyFactory'
import IUtils from './IUtils'

export default interface IThunkDependencies {
    keyHandler: IKeyHandler
    contractFactory: IContractFactory
    thorifyFactory: IThorifyFactory
    utils: IUtils
    wsApi: any
    slotsChannelHandler: any
}
