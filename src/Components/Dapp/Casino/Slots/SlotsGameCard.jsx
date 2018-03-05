import React from 'react'
import { Card } from 'material-ui'

const styles = require('../../../Base/styles').styles()
styles.card.padding = 0
styles.card.borderRadius = 15

export default function SlotsGameCard({ imageUrl, onClickListener }) {
    let imageSrc = `url(${ process.env.PUBLIC_URL }assets/img/${imageUrl})`
    return (
        <div className="col-6 hvr-float">
            <Card style={styles.card} className="mb-4">
                <div
                    style={{
                        background: imageSrc,
                        backgroundSize: 'cover',
                        paddingTop: 225,
                        height: 300,
                        borderRadius: styles.card.borderRadius
                    }}
                    onClick={onClickListener}
                />
            </Card>
        </div>
    )
}
