import * as React from 'react'
import { Paper, WithStyles, withStyles, createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        root: {
            transition: 'transform 0.4s',
            cursor: 'pointer',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            minWidth: 350,
            minHeight: 192
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
        const imageSrc = `${process.env.PUBLIC_URL}/assets/img/${
            this.props.imageUrl
        }`
        return (
            <Paper
                className={this.props.classes.root}
                onClick={this.onClickListener}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                title={this.props.gameName}
                style={{
                    transform: `translateY(${this.state.translateY})`,
                    backgroundImage: `url(${imageSrc})`
                }}
            />
        )
    }
}

export default withStyles(styles)(SlotsGameCard)
