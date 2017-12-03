/**
 * Created by user on 9/6/2017.
 */

const constants = require('../Constants')

export const
    styles = () => {
        return {
            card: {
                background: constants.COLOR_PRIMARY_DARK,
                borderRadius: 5,
                cursor: 'pointer',
                padding: 20
            },
            buttonLabel: {
                color: constants.COLOR_WHITE,
                fontFamily: 'TradeGothic'
            },
            textField: {
                hintStyle: {
                    color: constants.COLOR_WHITE_DARK
                },
                inputStyle: {
                    color: constants.COLOR_WHITE
                },
                floatingLabelStyle: {
                    color: constants.COLOR_GOLD,
                },
                floatingLabelFocusStyle: {
                    color: constants.COLOR_GOLD,
                },
                underlineStyle: {
                    borderColor: constants.COLOR_GOLD
                },
                underlineDisabledStyle: {
                    borderColor: constants.COLOR_WHITE_DARK
                }
            }
        }
    }

