import ITransactionHistoryState from './ITransactionHistoryState'
export default class TransactionHistoryState
    implements ITransactionHistoryState {
    constructor() {}
    public isLoading = false
    public error = false
    public errorMessage = ''
}
