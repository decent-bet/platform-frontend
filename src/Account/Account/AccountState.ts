import IAccountState from './IAccountState'
export default class AccountState implements IAccountState {
    public isSaving = false
    public activeStep = 0
}
