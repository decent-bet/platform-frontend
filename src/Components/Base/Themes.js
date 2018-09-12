/**
 * Created by user on 2/23/2017.
 */

import { createMuiTheme } from '@material-ui/core/styles'
import { COLOR_GOLD, COLOR_PRIMARY, COLOR_BACKGROUND } from './../Constants'

// Main Theme for all the Application
export const MainTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: COLOR_PRIMARY
        },
        secondary: {
            main: COLOR_GOLD
        },
        background: {
            paper: COLOR_BACKGROUND,
        }
    },

    typography: {
        fontFamily:
            '"Roboto", sans-serif'
    },

    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: COLOR_BACKGROUND
            }
        },
        MuiAppBar: {
            root: {
                height: 60
            },
            colorPrimary: {
                backgroundColor: COLOR_BACKGROUND
            }
        },
        MuiAvatar: {
            root: {
                backgroundColor: COLOR_BACKGROUND
            }
        },
        MuiToolbar: {
            root: {
                display: 'flex',
                alignItems: 'center'
            }
        },
        MuiButton: {
            root: {
                borderRadius: '2px'
            }
        },
        MuiButtonBase: {
            root: {
                textTransform: 'capitalize',
                '&:focus': {boxShadow: 'none', outline: 'none'},
                containedPrimary: {
                    color: '#29344f',
                },
                borderRadius: '2px'
            }
        },
        MuiCard: {
            root: {
                borderRadius: '2px'
            }
        }}
})
