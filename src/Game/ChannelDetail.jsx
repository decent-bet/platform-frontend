import {
    Card,
    CardHeader,
    CardContent,
    Collapse,
    SvgIcon,
    CardActions,
    IconButton,
    Typography
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import FormatEther from '../common/components/FormatEther'
import SpinHistory from './SpinHistory'

export default class ChannelDetail extends Component {
    state = {
        isOpen: false
    }

    onExpanderClickedListener = () =>
        this.setState({ isOpen: !this.state.isOpen })

    render() {
        const { initialDeposit, hashes, houseSpins, userHashes } = this.props

        const caretIcon = this.state.isOpen ? (
            <SvgIcon>
                <FontAwesomeIcon icon="caret-up" />
            </SvgIcon>
        ) : (
            <SvgIcon>
                <FontAwesomeIcon icon="caret-down" />
            </SvgIcon>
        )
        return (
            <Card className="card">
                <CardHeader title="Data for Nerds" />

                <CardActions>
                    <IconButton onClick={this.onExpanderClickedListener}>
                        {caretIcon}
                    </IconButton>
                </CardActions>

                <Collapse in={this.state.isOpen} unmountOnExit>
                    <CardContent>
                        <Typography component="dl">
                            <dt>Initial Deposit</dt>
                            <dd><FormatEther ether={initialDeposit}/> DBETs</dd>
                            <dt>Initial User Number</dt>
                            <dd>{hashes.initialUserNumber}</dd>
                            <dt>Final User Hash</dt>
                            <dd>{hashes.finalUserHash}</dd>
                            <dt>Final Reel Hash</dt>
                            <dd>{hashes.finalReelHash}</dd>
                            <dt>Final Seed Hash</dt>
                            <dd>{hashes.finalSeedHash}</dd>
                        </Typography>
                    </CardContent>

                    <CardHeader title="Spin History" />
                    <CardContent>
                        <SpinHistory
                            houseSpins={houseSpins}
                            userHashes={userHashes}
                        />
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}
