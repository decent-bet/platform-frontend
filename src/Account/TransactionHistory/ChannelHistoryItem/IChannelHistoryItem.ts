export default interface IChannelHistoryItem {
    id: string
    channelNonce: string
    initialDeposit: string

    createTime: string
    txCreateHash: string

    endTime: string
    txEndHash: string

    claimedTime: string
    txClaimedHash: string
    claimedDbets: string
}
