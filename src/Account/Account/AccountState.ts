import Routes from 'src/routes'

export interface IAccountState {
    activeTap: string
    isSaving: boolean
}

export const DefaultState: IAccountState = {
    isSaving: false,
    activeTap: Routes.AccountAddress
}
