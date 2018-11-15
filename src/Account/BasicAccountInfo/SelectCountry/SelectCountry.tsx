import * as React from 'react'
import Select from 'react-select'
import countries from './countries'
import styles from './styles'
import * as validator from 'validator'
// import CustomComponents from './CustomComponents'
import ISelectCountryProps from './ISelectCountryProps'
import { ISelectCountryState, SelectCountryState } from './SelectCountryState'
import { withStyles } from '@material-ui/core'

class SelectCountry extends React.PureComponent<
    ISelectCountryProps,
    ISelectCountryState
> {
    constructor(props: ISelectCountryProps) {
        super(props)
        this.state = new SelectCountryState()
    }

    public componentDidMount() {
        const { currentCountry } = this.props
        if (currentCountry && currentCountry.length > 0) {
            const selectedCountry =
                countries.find(item => item.value === currentCountry) || null

            this.setState({ selectedCountry })
        }
    }

    private onCountryValueChange(item: { value: string; label: string }) {
        if (
            this.state.selectedCountry &&
            this.state.selectedCountry.value !== item.value
        ) {
            let { error, errorMessage, selectedCountry } = this.state
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
                name="country"
                styles={selectStyles}
                isDisabled={!this.props.isEditing}
                className={
                    !this.props.isEditing ? classes.disableInputUnderline : ''
                }
                options={countries}
                value={this.state.selectedCountry}
                onChange={this.onCountryValueChange}
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(SelectCountry)
