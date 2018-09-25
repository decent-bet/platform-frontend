import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

const COLOR_PRIMARY = '#ffcb79',
      COLOR_SECONDARY = '#ffcb79',
      COLOR_BACKGROUND = '#475480',
      COLOR_BLUE_DARK = '#2a324e'

// Main Theme for all the Application
export const AppTheme = createMuiTheme({
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
                backgroundColor: COLOR_BLUE_DARK
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
                    color: '#29344f'
                },
                borderRadius: '2px'
            }
        },
        MuiCard: {
            root: {
                borderRadius: '2px'
            }
        }
    }
})
