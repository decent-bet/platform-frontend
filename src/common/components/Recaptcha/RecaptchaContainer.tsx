import { RECAPTCHA_SITE_KEY } from '../../../constants'
import * as React from 'react'
import { Grow, CircularProgress, Grid } from '@material-ui/core'
import TransparentPaper from '../TransparentPaper'
import Recaptcha from './Recaptcha'
import IRecaptchaContainerProps from './IRecaptchaContainerProps'
import {
    IRecaptchaContainerState,
    RecaptchaContainerState
} from './RecaptchaContainerState'

export default class RecaptchaContainer extends React.Component<
    IRecaptchaContainerProps,
    IRecaptchaContainerState
> {
    constructor(props: IRecaptchaContainerProps) {
        super(props)
        this.setGrecapchaInstance = this.setGrecapchaInstance.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.state = new RecaptchaContainerState()
    }

    public componentWillUnmount() {
        const { grecatpcha } = this.state.grecaptcha.state
        if (grecatpcha) {
            grecatpcha.reset()
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        if (prevState.grecaptcha.state !== this.state.grecaptcha.state) {
            this.setState({ loaded: true })
        }
    }

    private setGrecapchaInstance(grecaptcha) {
        this.setState({ grecaptcha })
    }

    private onLoad() {
        // this.setState({ loaded: true })
    }

    public render() {
        return (
            <Grid
                container={true}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid
                    item={true}
                    xs={12}
                    style={{
                        paddingTop: '2em',
                        paddingBottom: '1em'
                    }}
                >
                    <div
                        style={{ maxWidth: '260px !important', height: '78px' }}
                    >
                        <div
                            style={{
                                display: this.state.loaded ? 'none' : 'block',
                                textAlign: 'center'
                            }}
                        >
                            <CircularProgress size={24} color="secondary" />
                        </div>
                        <Grow in={this.state.loaded} timeout={1000}>
                            <TransparentPaper>
                                <Recaptcha
                                    ref={this.setGrecapchaInstance}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    theme="light"
                                    render="explicit"
                                    onloadCallback={this.onLoad}
                                    verifyCallback={this.props.onKeyChange}
                                />
                            </TransparentPaper>
                        </Grow>
                    </div>
                </Grid>
            </Grid>
        )
    }
}
