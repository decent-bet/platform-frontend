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
            }
        }
    }

