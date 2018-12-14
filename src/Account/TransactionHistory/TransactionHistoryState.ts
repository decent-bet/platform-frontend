export interface ITransactionHistoryState {
    currentIndex: number
    error: boolean
    errorMessage: string
}

export const DefaultState: ITransactionHistoryState = {
    currentIndex: 0,
    error: false,
    errorMessage: ''
}
