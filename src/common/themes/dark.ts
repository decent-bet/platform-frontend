import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

export const COLOR_PRIMARY = '#ffcb79',
    COLOR_SECONDARY = '#abc0f5',
    COLOR_BACKGROUND = '#475480',
    COLOR_BLUE_DRAWER = '#3b466c',
    DARK_TEXT_COLOR = '#29344f'

// Main Theme for all the Application
let theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: COLOR_PRIMARY
        },
        secondary: {
            main: COLOR_SECONDARY
        },
        background: {
            paper: COLOR_BACKGROUND
        }
    },

    typography: {
        fontFamily: '"Roboto", sans-serif'
    },

    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: COLOR_BLUE_DRAWER
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
                '&:focus': { boxShadow: 'none', outline: 'none' },
                containedPrimary: {
                    color: DARK_TEXT_COLOR
                },
                borderRadius: '2px'
            }
        },
        MuiCard: {
            root: {
                borderRadius: '2px',
                primary: {
                    color: COLOR_PRIMARY
                }
            }
        },
        MuiTableCell: {
            root: {
                borderBottom: '1px solid rgba(255,255,255, 0.6)'
            }
        }
    }
})

let darkTheme: any = theme
darkTheme.overrides.MuiPickersToolbar = {
    toolbar: {
        backgroundColor: COLOR_BLUE_DRAWER
    }
}

export default darkTheme
