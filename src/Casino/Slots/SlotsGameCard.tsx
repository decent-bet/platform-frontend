import * as React from 'react'
import { Paper, Card, CardMedia } from '@material-ui/core'
import { WithStyles, withStyles, createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        card: { transition: 'transform 0.5s' },
        media: {
            height: 192,
            cursor: 'pointer'
        }
    })

interface ISlotsGameCardProps extends WithStyles<typeof styles> {
    onGameSelectedListener: (name: string) => void
    allowSelect: boolean
    gameName: string
    imageUrl: string
}

interface ISlotsGameCardState {
    translateY: string
    paperElevation: number
}

class SlotsGameCard extends React.Component<
    ISlotsGameCardProps,
    ISlotsGameCardState
> {
    constructor(props: ISlotsGameCardProps) {
        super(props)
        this.onClickListener = this.onClickListener.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.onMouseOut = this.onMouseOut.bind(this)

        this.state = {
            translateY: '0',
            paperElevation: 4
        }
    }

    private onClickListener() {
        if (this.props.allowSelect) {
            this.props.onGameSelectedListener(this.props.gameName)
        }
    }

    private onMouseOver() {
        this.setState({ translateY: '-10px', paperElevation: 10 })
    }

    private onMouseOut() {
        this.setState({ translateY: '0', paperElevation: 4 })
    }

    public render() {
        const { imageUrl } = this.props
        const imageSrc = `${process.env.PUBLIC_URL}/assets/img/${imageUrl}`
        return (
            <Card
                className={this.props.classes.card}
                onClick={this.onClickListener}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                style={{ transform: `translateY(${this.state.translateY})` }}
            >
                <Paper elevation={this.state.paperElevation}>
                    <CardMedia
                        image={imageSrc}
                        title={imageUrl}
                        className={this.props.classes.media}
                    />
                </Paper>
            </Card>
        )
    }
}

export default withStyles(styles)(SlotsGameCard)
