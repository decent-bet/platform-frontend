import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CasinoRouter from './CasinoRouter'
import { getCasinoLoginStatus } from './state/thunks'
import Login from './Login'
import AppLoading from 'src/common/components/AppLoading'

class Casino extends React.Component<any, any> {
    public state = {
        casinoLoaded: false,
        loginModalOpen: false
    }

    constructor(props: any) {
        super(props)
        this.onLoginSuccess = this.onLoginSuccess.bind(this)
    }

    public async componentDidMount() {
        await this.props.getCasinoLoginStatus()
        this.setState({
            casinoLoaded: true
        })
    }

    private onLoginSuccess(): void {}

    public render() {
        if (!this.state.casinoLoaded) {
            return <AppLoading />
        }

        return (
            <React.Fragment>
                {!this.props.isCasinoLogedIn ? (
                    <Login
                        onLoginSuccess={this.onLoginSuccess}
                        account={this.props.account}
                    />
                ) : null}
                <CasinoRouter />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.casino, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, { getCasinoLoginStatus }), dispatch)

const CasinoContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Casino)

export default CasinoContainer
