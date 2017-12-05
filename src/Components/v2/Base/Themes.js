/**
 * Created by user on 2/23/2017.
 */

import getMuiTheme from 'material-ui/styles/getMuiTheme';

const constants = require('./../Constants')

class Themes {

    getAppBar = () => {
        return getMuiTheme({
            palette: {
                textColor: '#ffffff',
                alternateTextColor: '#F0AD4E',
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_PRIMARY_DARK
            },
            appBar: {
                height: 60,
            },
        })
    }

    getDialog = () => {
        return getMuiTheme({
            palette: {
                textColor: '#ffffff',
                alternateTextColor: '#F0AD4E',
                primary1Color: constants.COLOR_GOLD,
                primary2Color: constants.COLOR_GOLD,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_PRIMARY_DARK
            }
        })
    }

    getButtons = () => {
        return getMuiTheme({
            palette: {
                textColor: constants.COLOR_GOLD,
                alternateTextColor: constants.COLOR_GOLD,
                primary1Color: constants.COLOR_GOLD,
            }
        })
    }

}

export default Themes
