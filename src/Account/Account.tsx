import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import { Grid, Stepper, StepButton, Step } from '@material-ui/core'
import AccountAddress from './AccountAddress'
import AccountInfo from './AccountInfo'
// import Alert from '../common/components/Alert'

export interface IAccountState {
    activeStep: number
}

class Account extends React.Component<any, IAccountState> {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 0
        }
    }

    private handleStep = step => () => {
        this.setState({
            activeStep: step
        })
    }

    public render() {
        return (
            <Grid container={true} direction="column" spacing={40}>
                <Grid item={true} xs={12}>
                    <Stepper
                        alternativeLabel={true}
                        nonLinear={true}
                        activeStep={this.state.activeStep}
                    >
                        <Step completed={this.props.accountIsVerified}>
                            <StepButton onClick={this.handleStep(0)}>
                                Account info
                            </StepButton>
                        </Step>
                        <Step completed={this.props.accountHasAddress}>
                            <StepButton onClick={this.handleStep(1)}>
                                Public address
                            </StepButton>
                        </Step>
                    </Stepper>
                    {this.state.activeStep === 0 ? (
                        <AccountInfo />
                    ) : (
                        <AccountAddress />
                    )}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.account, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const AccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
export default AccountContainer
