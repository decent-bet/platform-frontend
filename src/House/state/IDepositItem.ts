import BigNumber from 'bignumber.js'

export interface IDepositItem {
    _address: string
    amount: BigNumber
    balance: BigNumber
}
