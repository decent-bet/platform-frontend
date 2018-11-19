import countries from 'iso-3166-1/src/iso-3166'
import { ICountryItem, CountryItem } from './CountryItem'

const countryList: [ICountryItem] = countries.map((item, _index) => {
    let country = new CountryItem()
    country.value = item.alpha3
    country.label = item.country
    return country
})
export default countryList
