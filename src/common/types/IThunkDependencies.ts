import IKeyHandler from './IKeyHandler'
import IContractFactory from './IContractFactory'
import IThorifyFactory from './IThorifyFactory'
import IUtils from './IUtils'
import IAuthProvider from './IAuthProvider'

export default interface IThunkDependencies {
    keyHandler: IKeyHandler
    contractFactory: IContractFactory
    thorifyFactory: IThorifyFactory
    utils: IUtils
    authProvider: IAuthProvider
    wsApi: any
    slotsChannelHandler: any
}
