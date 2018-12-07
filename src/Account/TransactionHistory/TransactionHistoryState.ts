export interface ITransactionHistoryState {
    isLoading: boolean
    error: boolean
    errorMessage: string
}

export const DefaultState: ITransactionHistoryState = {
    isLoading: false,
    error: false,
    errorMessage: ''
}
