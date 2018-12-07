import { BigNumber } from 'bignumber.js'
export interface IStateChannelBuilderProps {
    tokenBalance: number
    vthoBalance: number
    onBuildChannelListener: (number: BigNumber) => Promise<void>
}
