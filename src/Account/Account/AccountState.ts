export interface IAccountState {
    activeStep: number
    isSaving: boolean
}

export const DefaultState: IAccountState = {
    isSaving: false,
    activeStep: 0
}
