/**
 * Created by user on 2/23/2017.
 */

import { createMuiTheme } from '@material-ui/core/styles'
import { COLOR_GOLD, COLOR_GOLD_DARK, COLOR_PRIMARY_DARK, COLOR_ACCENT } from './../Constants'

// Main Theme for all the Application
export const MainTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: COLOR_GOLD,
            main: COLOR_GOLD_DARK
        },
        secondary: {
            main: COLOR_ACCENT
        },
        background: {
            paper: COLOR_PRIMARY_DARK
        }
    },

    typography: {
        fontFamily:
            '"TradeGothic", "Lato", "Hind", "Oswald", "Arial Narrow", sans-serif',
        button: {
            fontFamily: 'Inconsolata, monospace',
            fontSize: '0.75rem',
            textTransform: 'capitalize'
        }
    },

    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: COLOR_PRIMARY_DARK
            }
        },
        MuiInput: {
            input: {
                fontFamily: 'Inconsolata, monospace'
            }
        }
    }
})
