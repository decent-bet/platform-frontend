import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

const defaultFormat: BigNumber.Config = {
    FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ' ',
        groupSize: 3
    }
}

export function displayWeiToETH(balance: BigNumber): string {
    const converted = ethUnits.convert(balance.toString(), 'wei', 'ether')
    BigNumber.config(defaultFormat)
    return new BigNumber(converted).toFormat(5)
}

export function displayDBET(amount: BigNumber): string {
    BigNumber.config(defaultFormat)
    return amount.toFormat(2)
}
