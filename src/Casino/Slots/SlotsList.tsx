import React, { FunctionComponent } from 'react'
import SlotsGameCard from './SlotsGameCard'
import {
    createStyles,
    Grid,
    Card,
    Slide,
    CardContent,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core'
import TransparentPaper from '../../common/components/TransparentPaper'

interface ISlotsListProps {
    onGameSelectedListener: (name: string) => void
    allowSelect: boolean
    balance: string
}

interface IGameItem {
    name: string
    imageUrl: string
}

const gameList: IGameItem[] = [
    { name: 'mythsmagic', imageUrl: 'backgrounds/slots-mythsmagic.jpg' },
    { name: 'classic-7even', imageUrl: 'backgrounds/slots-classic-7even.jpg' },
    {
        name: 'monster-mayhem',
        imageUrl: 'backgrounds/slots-monster-mayhem.jpg'
    },
    { name: 'mount-crypto', imageUrl: 'backgrounds/slots-mount-crypto.jpg' },
    { name: 'shiprekt', imageUrl: 'backgrounds/slots-shiprekt.jpg' },
    { name: 'spaceman', imageUrl: 'backgrounds/slots-spaceman.jpg' },
    { name: 'crypto-chaos', imageUrl: 'backgrounds/slots-crypto-chaos.png' },
    {
        name: 'egyptian-treasures',
        imageUrl: 'backgrounds/slots-egyptian-treasures.jpg'
    },
    { name: 'defcon', imageUrl: 'backgrounds/slots-defcon.jpg' },
    { name: 'emoji-land', imageUrl: 'backgrounds/slots-emoji-land.jpg' }
]

const styles = (theme: Theme) =>
    createStyles({
        balanceCard: {
            backgroundColor: theme.palette.primary.main,
            '& h6': {
                color: theme.palette.getContrastText(theme.palette.primary.main)
            }
        }
    })

const SlotsList: FunctionComponent<
    ISlotsListProps & WithStyles<typeof styles>
> = function({ balance, onGameSelectedListener, allowSelect, classes }) {
    return (
        <Slide in={true} timeout={1000} direction="up">
            <TransparentPaper>
                <Grid container={true} spacing={40}>
                    {allowSelect ? (
                        <Grid item={true} xs={12}>
                            <Card className={classes.balanceCard}>
                                <CardContent>
                                    <Typography align="center" variant="h6">
                                        Session Balance: {balance} DBETs
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : null}
                    <Grid item={true} xs={12}>
                        <Grid
                            container={true}
                            direction="row"
                            justify="flex-start"
                            wrap="wrap"
                            spacing={24}
                        >
                            {gameList.map((game: IGameItem, index: number) => (
                                <Grid
                                    item={true}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={index}
                                >
                                    <TransparentPaper>
                                        <SlotsGameCard
                                            allowSelect={allowSelect}
                                            onGameSelectedListener={
                                                onGameSelectedListener
                                            }
                                            gameName={game.name}
                                            imageUrl={game.imageUrl}
                                        />
                                    </TransparentPaper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </TransparentPaper>
        </Slide>
    )
}

export default withStyles(styles)(SlotsList)
