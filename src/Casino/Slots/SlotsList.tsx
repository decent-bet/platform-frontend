import * as React from 'react'
import SlotsGameCard from './SlotsGameCard'
import { Grid, Card, CardContent } from '@material-ui/core'


interface ISlotsListProps {
    onGameSelectedListener: (name: string) => void
    allowSelect: boolean
    balance: number
  }
  

export default function SlotsList({ balance, onGameSelectedListener, allowSelect }: ISlotsListProps) {

    return (
        <React.Fragment>
            {
                allowSelect ?
                    <Grid container={true}>
                        <Grid item={true} xs={12}>
                            <Card className="channel-description card">
                                <CardContent component="header">{balance} DBETs</CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    : null
            }
            <Grid container={true} spacing={24}>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-mythsmagic.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="mythsmagic"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-classic-7even.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="classic-7even"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-monster-mayhem.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="monster-mayhem"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-mount-crypto.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="mount-crypto"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-shiprekt.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="shiprekt"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-spaceman.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="spaceman"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-egyptian-treasures.jpg"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="egyptian-treasures"
                    />
                </Grid>
                <Grid item={true} xs={6} sm={4}>
                    <SlotsGameCard
                        allowSelect={allowSelect}
                        imageUrl="backgrounds/slots-crypto-chaos.png"
                        onGameSelectedListener={onGameSelectedListener}
                        gameName="crypto-chaos"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
