import React from 'react'
import {
    RaisedButton,
    Card,
    CardHeader,
    CardText,
    CardActions
} from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const constants = require('./../../../Constants')
const styles = require('../../../Base/styles').styles()
styles.button = {
    fontSize: 12,
    marginTop: 12.5,
    marginRight: 10,
    fontFamily: 'Lato',
    color: constants.COLOR_WHITE
}
styles.card.borderRadius = 15

/** Slots chips are merely DBETs that're deposited into the Slots Channel Manager contract
 and can be withdrawn at any time*/
export default function ChipToolbar({
    onWithdrawChipsListener,
    onGetChipsListener,
    chipsLabel
}) {
    return (
        <Card style={styles.card} className="chip-toolbar-container">
            <CardText>
                <b>{chipsLabel} DBET Chips Available.</b>
                <br />
                Chips are DBET tokens that can be used in games.
            </CardText>

            <CardActions>
                <RaisedButton
                    icon={<FontAwesomeIcon icon="plus" />}
                    secondary={true}
                    onClick={onGetChipsListener}
                    label="Add more chips"
                />
                <RaisedButton
                    icon={<FontAwesomeIcon icon="minus" />}
                    secondary={true}
                    onClick={onWithdrawChipsListener}
                    label="Withdraw Chips"
                />
            </CardActions>
        </Card>
    )
}
