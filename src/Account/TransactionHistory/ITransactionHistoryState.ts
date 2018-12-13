export default interface ITransactionHistoryState {
    currentIndex: number
    isLoading: boolean
    isLoadingMore: boolean
    error: boolean
    errorMessage: string
}
