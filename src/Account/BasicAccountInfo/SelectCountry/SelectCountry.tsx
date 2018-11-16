import * as React from 'react'
import Select from 'react-select'
import countryList from './countryList'
import styles from './styles'
import * as validator from 'validator'
import getCustomComponents from './CustomComponents'
import ISelectCountryProps from './ISelectCountryProps'
import SelectCountryState from './SelectCountryState'
import ISelectCountryState from './SelectCountryState'
import { withStyles } from '@material-ui/core'

class SelectCountry extends React.Component<
    ISelectCountryProps,
    ISelectCountryState
> {
    constructor(props: ISelectCountryProps) {
        super(props)
        this.state = new SelectCountryState()
        this.onCountryValueChange = this.onCountryValueChange.bind(this)
    }

    public componentDidMount() {
        const { currentCountry } = this.props
        if (currentCountry && currentCountry.length > 0) {
            const selectedCountry = countryList.find(
                item => item.value === currentCountry
            )

            this.setState({ selectedCountry })
        }
    }

    private onCountryValueChange(item: { value: string; label: string }) {
        let { selectedCountry } = this.state
        if (
            item &&
            (!selectedCountry ||
                (selectedCountry && selectedCountry.value !== item.value))
        ) {
            let { error, errorMessage } = this.state
            const country = item.value || ''
            selectedCountry = item

            if (country.length <= 0) {
                error = true
                errorMessage = 'The country is required'
            } else if (!(validator as any).isISO31661Alpha3(country)) {
                error = true
                errorMessage = 'Invalid country'
            } else {
                error = false
                errorMessage = ''
            }

            this.setState({ selectedCountry, errorMessage, error })

            this.props.onCountryValueChange(country)
        }
    }

    public render() {
        const { classes, theme } = this.props

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit'
                }
            })
        }

        return (
            <Select
                placeholder="Country"
                isSearchable={true}
                name="country"
                styles={selectStyles}
                isDisabled={!this.props.isEditing}
                className={
                    !this.props.isEditing ? classes.disableInputUnderline : ''
                }
                options={countryList}
                value={this.state.selectedCountry}
                onChange={this.onCountryValueChange}
                components={getCustomComponents(
                    this.state.error,
                    this.state.errorMessage
                )}
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(SelectCountry)
