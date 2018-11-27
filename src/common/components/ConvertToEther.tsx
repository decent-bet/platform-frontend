
import * as React from 'react'
import ethUnits from 'ethereum-units'
import BigNumber from 'bignumber.js'

export interface IConvertToEtherProps {
    input: number|string
}
export default function ConvertToEther(props: IConvertToEtherProps){
    let converted = new BigNumber(props.input).times(ethUnits.units.ether).toFixed(0)
    return (<span>{converted}</span>)
}

