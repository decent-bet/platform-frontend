import { WithStyles } from '@material-ui/core'
import styles from './styles'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export default interface IPublicRouteContainerProps
    extends WithStyles<typeof styles> {
    width: Breakpoint
}
