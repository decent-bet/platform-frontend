import ISelectCountryState from './ISelectCountryState'
import { ICountryItem } from './CountryItem'

export default class SelectCountryState implements ISelectCountryState {
    constructor() {}
    public selectedCountry?: ICountryItem | null | undefined
    public errorMessage = ''
    public error = false
}
