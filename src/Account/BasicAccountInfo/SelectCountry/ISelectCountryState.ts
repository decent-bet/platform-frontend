import { ICountryItem } from './CountryItem'

export default interface ISelectCountryState {
    selectedCountry?: ICountryItem | null | undefined
    errorMessage: string
    error: boolean
}
