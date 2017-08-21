/**
 * Created by user on 2/23/2017.
 */

import getMuiTheme from 'material-ui/styles/getMuiTheme';

const constants = require('./../Constants')

class Themes {

    getAppBar() {
        return getMuiTheme({
            palette: {
                textColor: '#333333',
                alternateTextColor: constants.COLOR_GOLD,
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_BLACK
            },
            appBar: {
                height: 60,
            },
        })
    }

    getProgressBar() {
        return getMuiTheme({
            palette: {
                primary1Color: constants.COLOR_GOLD,
                primary3Color: '#000000'
            }
        })
    }

}

export default Themes
