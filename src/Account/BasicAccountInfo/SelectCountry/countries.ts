import countries from 'iso-3166-1/src/iso-3166'
const COUNTRY_LIST: [{ value: string; label: string }] = countries.map(
    (item, _index) => {
        return { value: item.alpha3, label: item.country }
    }
)

export default COUNTRY_LIST
