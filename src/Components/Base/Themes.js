/**
 * Created by user on 2/23/2017.
 */

import { createMuiTheme } from '@material-ui/core/styles'
import * as constants from './../Constants'

// Main Theme for all the Application
export const MainTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: constants.COLOR_GOLD,
            main: constants.COLOR_GOLD_DARK
        },
        secondary: {
            main: constants.COLOR_ACCENT
        },
        background: {
            paper: constants.COLOR_PRIMARY_DARK
        }
    },

    typography: {
        button: {
            fontFamily: 'Inconsolata, monospace',
            fontSize: '0.75rem',
            textTransform: 'capitalize'
        },
    },

    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: constants.COLOR_PRIMARY_DARK
            }
        },
        MuiInput: {
            input : {
                fontFamily: 'Inconsolata, monospace'
            }
        }
    }
})
