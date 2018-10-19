import { RECAPTCHA_SITE_KEY } from '../../../constants'
import * as React from 'react'
import { Grow, CircularProgress, Grid } from '@material-ui/core'
import TransparentPaper from '../TransparentPaper'
import Recaptcha from './Recaptcha'
import IRecaptchaContainerProps from './IRecaptchaContainerProps'

export default class RecaptchaContainer extends React.Component<
    IRecaptchaContainerProps
> {
    private recaptchaInstance?: any = null
    public state = {
        loaded: false
    }

    constructor(props: IRecaptchaContainerProps) {
        super(props)
        this.setRecapchaInstance = this.setRecapchaInstance.bind(this)
        this.onLoad = this.onLoad.bind(this)
    }

    public componentWillUnmount() {
        if (this.recaptchaInstance != null) {
            this.recaptchaInstance.reset()
        }
    }

    private setRecapchaInstance(instance) {
        this.recaptchaInstance = instance
        this.recaptchaInstance.render()
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
                                    ref={this.setRecapchaInstance}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    theme="light"
                                    render="explicit"
                                    verifyCallback={this.props.onKeyChange}
                                    onloadCallback={this.onLoad}
                                />
                            </TransparentPaper>
                        </Grow>
                    </div>
                </Grid>
            </Grid>
        )
    }
}
