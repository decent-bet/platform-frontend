export default interface IChannelHistoryItem {
    id: string
    channelNonce: string
    initialDeposit: string
    createTime: string
    txCreateHash: string
    userAddress: string
    ready: boolean
    activated: boolean
    finalized: boolean
    finalNonce: string
    endTime: string
    exist: boolean
    txEndHash: string
    txClaimedHash: string
}
