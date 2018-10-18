import * as React from 'react'
import SlotsGameCard from './SlotsGameCard'
import { Grid, Card, Slide, CardContent, Typography } from '@material-ui/core'
import TransparentPaper from '../../common/components/TransparentPaper'
import { COLOR_PRIMARY, DARK_TEXT_COLOR } from 'src/common/themes/dark'

interface ISlotsListProps {
    onGameSelectedListener: (name: string) => void
    allowSelect: boolean
    balance: number
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
    }
]

export default function SlotsList({
    balance,
    onGameSelectedListener,
    allowSelect
}: ISlotsListProps) {
    return (
        <Slide in={true} timeout={1000} direction="up">
            <TransparentPaper>
                <Grid container={true} spacing={40}>
                    {allowSelect ? (
                        <Grid item={true} xs={12}>
                            <Card style={{ backgroundColor: COLOR_PRIMARY }}>
                                <CardContent>
                                    <Typography
                                        style={{ color: DARK_TEXT_COLOR }}
                                        align="center"
                                        variant="title"
                                    >
                                        {balance} DBETs
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
