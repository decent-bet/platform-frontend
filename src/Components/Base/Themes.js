/**
 * Created by user on 2/23/2017.
 */

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import * as constants from './../Constants'

// Main Theme for all the Application
export const MainTheme = getMuiTheme(darkBaseTheme, {
    palette: {
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
