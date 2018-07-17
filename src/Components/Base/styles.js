import {
    COLOR_PRIMARY_DARK_TRANSLUCENT,
    COLOR_WHITE,
    COLOR_WHITE_DARK,
    COLOR_ACCENT_DARK,
    COLOR_GOLD,
    COLOR_TRANSPARENT,
    COLOR_GREY
} from '../Constants'

export const styles = () => {
    return {
        card: {
            background: COLOR_PRIMARY_DARK_TRANSLUCENT,
            borderRadius: 15,
            padding: 20
        },
        buttonLabel: {
            color: COLOR_WHITE,
            fontFamily: 'TradeGothic'
        },
        appbarButton: {
            fontSize: 12,
            marginTop: 5,
            marginRight: 10,
            fontFamily: 'Lato',
            color: COLOR_WHITE
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
                color: COLOR_WHITE_DARK,
            },
            inputStyle: {
                color: COLOR_GREY,
                fontSize: '1.25rem',
                fontFamily: 'Lato'
            },
            errorStyle: {
                color: COLOR_ACCENT_DARK,
            },
            underlineStyle: {
                borderColor: COLOR_GOLD,
            },
            floatingLabelStyle: {
                color: COLOR_GOLD,
            },
            floatingLabelFocusStyle: {
                color: COLOR_GOLD,
            }
        },
        dropdown: {
            underlineStyle: {
                borderColor: COLOR_TRANSPARENT
            },
            labelStyle: {
                color: COLOR_GREY,
                fontFamily: 'Lato',
                fontSize: 17
            },
            selectedMenuItemStyle: {
                color: COLOR_WHITE
            },
            menuItemStyle: {
                color: COLOR_WHITE_DARK
            },
            listStyle: {
                backgroundColor: 'rgba(29, 32, 39, 0.85)'
            }
        },
        button: {
            label: {
                color: COLOR_WHITE,
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }
        },
        menuItem: {
            color: COLOR_GREY,
            fontFamily: 'TradeGothicLt',
            fontSize: 16,
            padding: '5px'
        },
        selectedMenuItem: {
            color: COLOR_GOLD,
            fontFamily: 'TradeGothicLt',
            fontSize: 16,
            padding: '5px'
        }
    }
}
