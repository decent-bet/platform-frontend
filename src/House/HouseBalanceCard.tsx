import React, { FunctionComponent } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    withStyles,
    WithStyles,
    Theme,
    Typography
} from '@material-ui/core'
import { IHouseBalanceCardProps } from './IHouseBalanceCardProps'
import { displayWeiToETH } from './common/functions'

const styles = (theme: Theme) => {
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.getContrastText(primaryColor)
    return createStyles({
        accentContainer: {
            backgroundColor: primaryColor,
            '& span': {
                color: textColor
            }
        },
        accentText: {
            color: textColor
        }
    })
}

/**
 * The card that shows the balance of the House Account
 * @param balance The amount to show in the card.
 */
const HouseBalanceCard: FunctionComponent<
    IHouseBalanceCardProps & WithStyles<typeof styles>
> = ({ balance, classes }) => (
    <Card className={classes.accentContainer}>
        <CardHeader title="House Balance" />
        <CardContent>
            <Typography
                variant="h4"
                className={classes.accentText}
            >{`${displayWeiToETH(balance)} DBETs`}</Typography>
        </CardContent>
    </Card>
)
export default withStyles(styles)(HouseBalanceCard)
