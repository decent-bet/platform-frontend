/**
 * Created by user on 2/23/2017.
 */

import { createMuiTheme } from '@material-ui/core/styles'
import * as constants from './../Constants'

// Main Theme for all the Application
export const MainTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary1Color: constants.COLOR_GOLD,
        primary2Color: constants.COLOR_GOLD_DARK,
        accent1Color: constants.COLOR_BLUE,
        canvasColor: constants.COLOR_PRIMARY_DARK
    },
    appBar: {
        textColor: constants.COLOR_WHITE,
        color: constants.COLOR_PRIMARY,
        height: 60
    },
    button: {
        textTransform: 'capitalize'
    }
})
