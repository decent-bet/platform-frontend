export interface IAccountState {
    activeTap: number
    isSaving: boolean
}

export let DefaultState: IAccountState = {
    isSaving: false,
    activeTap: 0
}
