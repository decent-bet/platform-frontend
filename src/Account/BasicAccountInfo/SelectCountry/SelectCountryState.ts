export interface ISelectCountryState {
    selectedCountry?: { value: string; label: string } | null
    errorMessage: string
    error: boolean
}

export class SelectCountryState implements ISelectCountryState {
    constructor() {}
    public selectedCountry = undefined
    public errorMessage = ''
    public error = false
}
