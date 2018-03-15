/**
 * Created by user on 2/23/2017.
 */

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'

const constants = require('./../Constants')

// Main Theme for all the Application
const MainTheme = getMuiTheme(darkBaseTheme, {
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
    }
})

// DEPRECATED: Theme used for the snackbar
const SnackbarTheme = getMuiTheme({
    palette: {
        textColor: constants.COLOR_PRIMARY,
        alternateTextColor: constants.COLOR_WHITE,
        primary1Color: constants.COLOR_PRIMARY,
        primary2Color: constants.COLOR_PRIMARY_DARK,
        accent1Color: constants.COLOR_RED,
        canvasColor: constants.COLOR_PRIMARY
    }
})

// DEPRECATED: Used for the red Buttons
const ButtonsTheme = getMuiTheme({
    palette: {
        textColor: constants.COLOR_GOLD,
        alternateTextColor: constants.COLOR_GOLD,
        primary1Color: constants.COLOR_GOLD
    }
})

// DEPRECATED: Used for certain dialogs
const DialogTheme = getMuiTheme({
    palette: {
        textColor: '#ffffff',
        alternateTextColor: '#F0AD4E',
        primary1Color: constants.COLOR_GOLD,
        primary2Color: constants.COLOR_GOLD,
        accent1Color: constants.COLOR_RED,
        canvasColor: constants.COLOR_PRIMARY_DARK
    }
})

export { MainTheme, SnackbarTheme, DialogTheme, ButtonsTheme }
