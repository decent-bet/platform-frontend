import React from 'react'
import { Card, CardMedia, CardText } from 'material-ui'
import NullableLink from './NullableLink'

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
        <section className="game-card">
            <NullableLink to={url}>
                <Card className="card">
                    <CardMedia>
                        <div
                            className="background"
                            style={{
                                background: parsedBackground
                            }}
                        />
                    </CardMedia>

                    <CardText className="title">
                        <h4>{title}</h4>
                        <Subtitle available={available} />
                    </CardText>
                </Card>
            </NullableLink>
        </section>
    )
}
