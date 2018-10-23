import { RECAPTCHA_SITE_KEY } from '../../../config'
import * as React from 'react'
import { Grid, CircularProgress, Fade } from '@material-ui/core'
import TransparentPaper from '../TransparentPaper'
import Recaptcha from './Recaptcha'
import IRecaptchaContainerProps from './IRecaptchaContainerProps'
import {
    IRecaptchaContainerState,
    RecaptchaContainerState
} from './RecaptchaContainerState'

export default class RecaptchaContainer extends React.PureComponent<
    IRecaptchaContainerProps,
    IRecaptchaContainerState
> {
    constructor(props: IRecaptchaContainerProps) {
        super(props)
        this.setRecaptchaRef = this.setRecaptchaRef.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.state = new RecaptchaContainerState()
    }

    public componentWillUnmount() {
        if (this.state.recatpchaRef) {
            this.state.recatpchaRef.reset()
        }
    }

    private setRecaptchaRef(recatpchaRef) {
        this.setState({ recatpchaRef })
        this.props.onSetRef(recatpchaRef)
    }

    private onLoad() {
        this.setState({ loaded: true })
    }

    public render() {
        return (
            <Grid
                container={true}
                direction="column"
                alignItems="center"
                justify="center"
                style={{
                    paddingTop: '2em',
                    paddingBottom: '1em'
                }}
            >
                <Grid
                    item={true}
                    xs={12}
                    style={{
                        height: 85
                    }}
                >
                    <CircularProgress
                        style={{
                            display: this.state.loaded ? 'none' : 'block'
                        }}
                        size={24}
                    />
                    <Fade in={this.state.loaded}>
                        <TransparentPaper>
                            <Recaptcha
                                ref={this.setRecaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                theme="light"
                                render="explicit"
                                onloadCallback={this.onLoad}
                                verifyCallback={this.props.onKeyChange}
                            />
                        </TransparentPaper>
                    </Fade>
                </Grid>
            </Grid>
        )
    }
}
