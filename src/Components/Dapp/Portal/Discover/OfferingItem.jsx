import React from 'react'
import { Card } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const styles = {
    card: _offering => {
        return {
            borderRadius: 8,
            height: 115,
            background:
                'url(' +
                process.env.PUBLIC_URL +
                '/assets/img/offerings/' +
                _offering.imgUrl +
                ')',
            backgroundSize: 'cover',
            backgroundRepeat: 'none'
        }
    }
}

export default function OfferingItem({ offering, index }) {
    return (
        <div className={'col offering pr-2'}>
            <Card style={styles.card(offering)} className="clickable" />
            <p className="mt-3 ml-2">
                {offering.name}{' '}
                <FontAwesomeIcon icon="caret-right" className="ml-3 icon" />
            </p>
        </div>
    )
}
