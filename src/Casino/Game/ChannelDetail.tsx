import {
    AppBar,
    Toolbar,
    Card,
    Grid,
    CardContent,
    Collapse,
    ButtonBase,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import * as React from 'react'
import FormatEther from '../../common/components/FormatEther'
import SpinHistory from './SpinHistory'

export default class ChannelDetail extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }

        this.onExpanderClickedListener = this.onExpanderClickedListener.bind(
            this
        )
    }

    private onExpanderClickedListener() {
        this.setState({ isOpen: !this.state.isOpen })
    }

    public render() {
        const { initialDeposit, hashes, houseSpins, userHashes } = this.props

        const caretIcon = this.state.isOpen ? (
            <KeyboardArrowUpIcon />
        ) : (
            <KeyboardArrowDownIcon />
        )
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            container={true}
                            direction="row"
                            alignItems="center"
                            justify="space-between"
                        >
                            <ButtonBase
                                onClick={this.onExpanderClickedListener}
                            >
                                <Typography variant="title">
                                    Data for Nerds
                                </Typography>
                            </ButtonBase>
                            <IconButton
                                onClick={this.onExpanderClickedListener}
                            >
                                {caretIcon}
                            </IconButton>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Collapse in={this.state.isOpen} unmountOnExit={true}>
                    <Card>
                        <CardContent>
                            <Grid
                                container={true}
                                direction="column"
                                spacing={24}
                            >
                                <Grid item={true}>
                                    <List dense={true}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography color="primary">
                                                        Initial Deposit
                                                    </Typography>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <FormatEther
                                                            ether={
                                                                initialDeposit
                                                            }
                                                        />{' '}
                                                        DBETs
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography color="primary">
                                                        Initial User Number
                                                    </Typography>
                                                }
                                                secondary={
                                                    hashes.initialUserNumber
                                                }
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography color="primary">
                                                        Final User Hash
                                                    </Typography>
                                                }
                                                secondary={hashes.finalUserHash}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography color="primary">
                                                        Final Reel Hash
                                                    </Typography>
                                                }
                                                secondary={hashes.finalReelHash}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography color="primary">
                                                        Final Seed Hash
                                                    </Typography>
                                                }
                                                secondary={hashes.finalSeedHash}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item={true}>
                                    <Typography variant="title">
                                        Spin History
                                    </Typography>
                                </Grid>
                                <Grid item={true}>
                                    <SpinHistory
                                        houseSpins={houseSpins}
                                        userHashes={userHashes}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Collapse>
            </React.Fragment>
        )
    }
}
