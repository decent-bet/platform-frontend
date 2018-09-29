
import * as React from 'react'
import ethUnits from 'ethereum-units'
import BigNumber from 'bignumber.js'

export interface IFormatEthersProps {
    ether: number|string
}
export default function FormatEther(props: IFormatEthersProps){
    let formated = new BigNumber(props.ether).dividedBy(ethUnits.units.ether).toFixed(2)
    return (<span>{formated}</span>)
}

