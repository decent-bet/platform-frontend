import React from 'react'
import { Card } from 'material-ui'
import NullableLink from './NullableLink'

const styles = require('../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15

// The Text beow the card
function Subtitle({ available }) {
    if (available) {
        return <p className="mb-0 text-success">AVAILABLE NOW</p>
    } else {
        return <p className="mb-0 text-danger">AVAILABLE SOON</p>
    }
}

// Each card shown in the main menu of the "Casino Page"
export default function GameCard({ title, imgUrl, url, available }) {
    let parsedBackground =
        (available
            ? ''
            : 'linear-gradient(' +
              'rgba(0, 0, 0, 0.6),' +
              'rgba(0, 0, 0, 0.6)' +
              '), ') +
        'url(' +
        process.env.PUBLIC_URL +
        'assets/img/' +
        imgUrl +
        ')'
    return (
        <div className="col-6 hvr-float game-card">
            <NullableLink to={url}>
                <Card style={styles.card} className="mb-4">
                    <div
                        style={{
                            background: parsedBackground,
                            backgroundSize: 'cover',
                            paddingTop: 200,
                            height: 300,
                            borderRadius: styles.card.borderRadius
                        }}
                    >
                        <div className="title">
                            <h4 className="mb-0">{title}</h4>
                            <Subtitle available={available} />
                        </div>
                    </div>
                </Card>
            </NullableLink>
        </div>
    )
}
