import React from 'react'
import { RaisedButton, Card, CardText, CardActions } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

/** Slots chips are merely DBETs that're deposited into the Slots Channel Manager contract
 and can be withdrawn at any time*/
export default function ChipToolbar({
    onWithdrawChipsListener,
    onGetChipsListener,
    chipsLabel
}) {
    return (
        <Card className="chip-toolbar-container card">
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
