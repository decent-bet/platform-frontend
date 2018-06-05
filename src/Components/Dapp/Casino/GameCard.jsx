import React from 'react'
import { Card, CardMedia, CardContent } from '@material-ui/core'

// Each card shown in the main menu of the "Casino Page"
export default class GameCard extends React.Component {
    // When the card is clicked, go to the game
    onClickListener = () => {
        if (!this.props.url) {
            return
        }
        this.props.history.push(this.props.url)
    }

    //The text below the Card
    renderSubtitle = () => {
        if (this.props.available) {
            return <p className="mb-0 text-success">AVAILABLE NOW</p>
        } else {
            return <p className="mb-0 text-danger">AVAILABLE SOON</p>
        }
    }

    render() {
        let { title, imgUrl, available } = this.props
        let backgroundImage = `url(${
            process.env.PUBLIC_URL
        }assets/img/${imgUrl})`

        // Adds an overlay over the unavailable games
        let overlay =
            'linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), '
        let parsedBackground = available
            ? backgroundImage
            : overlay + backgroundImage

        return (
            <Card className="game-card" onClick={this.onClickListener}>
                <CardMedia>
                    <div
                        className="background"
                        style={{
                            background: parsedBackground
                        }}
                    />
                </CardMedia>

                <CardContent className="title">
                    <h4>{title}</h4>
                    {this.renderSubtitle()}
                </CardContent>
            </Card>
        )
    }
}
