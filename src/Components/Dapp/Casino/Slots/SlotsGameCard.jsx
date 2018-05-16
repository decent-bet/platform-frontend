import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardMedia } from 'material-ui'

class SlotsGameCard extends Component {
    onClickListener = () => this.props.onGameSelectedListener(this.props.gameName)
    render() {
        const { imageUrl } = this.props
        let imageSrc = `${process.env.PUBLIC_URL}/assets/img/${imageUrl}`
        return (
            <Card
                className="game-card hvr-float"
                onClick={this.onClickListener}
            >
                <CardMedia>
                    <img src={imageSrc} alt={imageUrl} />
                </CardMedia>
            </Card>
        )
    }
}

SlotsGameCard.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    onGameSelectedListener: PropTypes.func.isRequired,
    gameName: PropTypes.string.isRequired
}

export default SlotsGameCard