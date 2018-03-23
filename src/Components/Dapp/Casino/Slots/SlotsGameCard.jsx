import React from 'react'
import { Card, CardMedia } from 'material-ui'

export default function SlotsGameCard({ imageUrl, onClickListener }) {
    let imageSrc = `${process.env.PUBLIC_URL}/assets/img/${imageUrl}`
    return (
        <Card className="game-card hvr-float" onClick={onClickListener}>
            <CardMedia>
                <img src={imageSrc} alt={imageUrl} />
            </CardMedia>
        </Card>
    )
}
