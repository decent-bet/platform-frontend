import { WithStyles } from '@material-ui/core'
import styles from './styles'

export default interface ISelectCountryProps
    extends WithStyles<typeof styles, true> {
    currentCountry: string | null
    isEditing: boolean
    onCountryValueChange(value: string): void
}
