import IKeyHandler from './IKeyHandler'
import IContractFactory from './IContractFactory'
import IThorifyFactory from './IThorifyFactory'
import IUtils from './IUtils'

export default interface IThunkDependencies {
    contractFactory: IContractFactory
    keyHandler: IKeyHandler
    thorifyFactory: IThorifyFactory
    utils: IUtils
}
