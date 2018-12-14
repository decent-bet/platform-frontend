import Routes from '../../routes'

export interface IAccountState {
    activeTap: Routes
    isSaving: boolean
}

export const DefaultState: IAccountState = {
    isSaving: false,
    activeTap: Routes.AccountAddress
}
