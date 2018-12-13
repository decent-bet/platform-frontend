import ITransactionHistoryState from './ITransactionHistoryState'

export default class TransactionHistoryState
    implements ITransactionHistoryState {
    public currentIndex = 0
    public isLoading = false
    public isLoadingMore = false
    public error = false
    public errorMessage = ''
}
