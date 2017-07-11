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
                alternateTextColor: '#ffffff',
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_WHITE
            },
            appBar: {
                height: 60,
            },
        })
    }

}

export default Themes
