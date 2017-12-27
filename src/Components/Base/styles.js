const constants = require('../Constants')

export const styles = () => {
    return {
        card: {
            background: constants.COLOR_PRIMARY_DARK_TRANSLUCENT,
            borderRadius: 5,
            cursor: 'pointer',
            padding: 20
        },
        buttonLabel: {
            color: constants.COLOR_WHITE,
            fontFamily: 'TradeGothic'
        },
        appbar: {
            position: 'fixed',
            top: 0
        },
        addressLabel: {
            fontFamily: 'Inconsolata',
            fontSize: '0.95rem',
            letterSpacing: '1px',
            textTransform: 'none'
        },
        keyboard: {
            key: {
                height: '100%',
                padding: '20px 0'
            },
            label: {
                fontFamily: 'Roboto Light',
                fontSize: '2.25rem',
                textShadow: '1px 1px #1c1f28'
            },
            send: {
                fontFamily: 'Roboto Light',
                fontSize: '1.25rem',
                textShadow: '1px 1px #1c1f28'
            },
            sendDisabled: {
                fontFamily: 'Roboto Light',
                fontSize: '1.25rem',
            }
        },
        drawerToggle: {
            fontSize: '1rem',
            fontFamily: 'Roboto'
        },
        textField: {
            hintStyle: {
                color: constants.COLOR_WHITE_DARK,
            },
            inputStyle: {
                color: constants.COLOR_GREY,
                fontSize: '1.25rem',
                fontFamily: 'Lato'
            },
            errorStyle: {
                color: constants.COLOR_ACCENT_DARK,
            },
            underlineStyle: {
                borderColor: constants.COLOR_GOLD,
            },
            floatingLabelStyle: {
                color: constants.COLOR_GOLD,
            },
            floatingLabelFocusStyle: {
                color: constants.COLOR_GOLD,
            }
        },
        dropdown: {
            underlineStyle: {
                borderColor: constants.COLOR_TRANSPARENT
            },
            labelStyle: {
                color: constants.COLOR_GREY,
                fontFamily: 'Lato',
                fontSize: 17
            },
            selectedMenuItemStyle: {
                color: constants.COLOR_WHITE
            },
            menuItemStyle: {
                color: constants.COLOR_WHITE_DARK
            },
            listStyle: {
                backgroundColor: 'rgba(29, 32, 39, 0.85)'
            }
        },
        button: {
            label: {
                color: constants.COLOR_WHITE,
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }
        },
        menuItem: {
            color: constants.COLOR_GREY,
            fontFamily: 'TradeGothicLt',
            fontSize: 16,
            padding: '5px'
        },
        selectedMenuItem: {
            color: constants.COLOR_GOLD,
            fontFamily: 'TradeGothicLt',
            fontSize: 16,
            padding: '5px'
        }
    }
}

