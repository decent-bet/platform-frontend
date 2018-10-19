import { RECAPTCHA_SITE_KEY } from '../../../constants'
import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Grow, CircularProgress, Grid } from '@material-ui/core'

interface IRecaptchaProps {
    onChange: (key: string) => void
    onReceiveRecaptchaInstance: (instance: React.RefObject<ReCAPTCHA>) => void
}

export default class ReCaptcha extends React.Component<IRecaptchaProps> {
    private _reCaptchaRef: React.RefObject<ReCAPTCHA>
    private _interval: NodeJS.Timer
    public state = {
        loaded: false
    }

    constructor(props: IRecaptchaProps) {
        super(props)
        this._reCaptchaRef = React.createRef<ReCAPTCHA>()
    }

    public componentDidMount() {
        this._interval = setInterval(() => {
            const { grecaptcha } = window as any
            if (grecaptcha) {
                clearInterval(this._interval)
                this.setState({ loaded: true })
                this.props.onReceiveRecaptchaInstance(this._reCaptchaRef)
            }
        }, 500)
    }

    public componentWillUnmount = () => {
        if (this._reCaptchaRef && this._reCaptchaRef.current) {
            this._reCaptchaRef.current.reset()
        }
    }

    private onChange = recaptchaToken => {
        this.props.onChange(recaptchaToken || '')
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
                            <ReCAPTCHA
                                ref={this._reCaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={this.onChange}
                                theme="light"
                            />
                            {this.props.children}
                        </Grow>
                    </div>
                </Grid>
            </Grid>
        )
    }
}
