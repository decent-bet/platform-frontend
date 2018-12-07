import BigNumber from 'bignumber.js'
import ethUnits from 'ethereum-units'

export function displayWeiToETH(balance: BigNumber): string {
    const converted = ethUnits.convert(balance.toString(), 'wei', 'ether')
    BigNumber.config({
        FORMAT: {
            decimalSeparator: '.',
            groupSeparator: ' ',
            groupSize: 3
        }
    })
    return new BigNumber(converted).toFormat(5)
}
