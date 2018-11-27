import ICountryItem from './ICountryItem'

export default class CountryItem implements ICountryItem {
    public value: string
    public label: string

    public contructor(value: string, label: string) {
        this.value = value
        this.label = label
    }
}
