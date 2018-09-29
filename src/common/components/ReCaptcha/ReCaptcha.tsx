import { RECAPTCHA_SITE_KEY } from '../../../constants'
import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { CircularProgress } from '@material-ui/core'

interface IRecaptchaProps {
    onChange: (key: string) => void
}

export default class ReCaptcha extends React.Component<IRecaptchaProps> {
    private _reCaptchaRef?: React.RefObject<ReCAPTCHA>
    public state = {
        loaded: false
    }

    constructor(props: IRecaptchaProps) {
        super(props)
    }

    public componentWillUnmount = () => {
        if (this._reCaptchaRef && this._reCaptchaRef.current) {
            this._reCaptchaRef.current.reset()
        }
    }

    private setRef = (ref: any) => {
        this._reCaptchaRef = ref
        if (this._reCaptchaRef) {
            setTimeout(() => {
                this.setState({ loaded: true })
            }, 1000)
        }
    }

    private onChange = recaptchaToken => {
        this.props.onChange(recaptchaToken)
    }

    public render() {
        return (
            <React.Fragment>
                <div style={{ display: this.state.loaded ? 'block' : 'none' }}>
                    <ReCAPTCHA
                        ref={this.setRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={this.onChange}
                        theme="light"
                    />
                </div>
                <div style={{ display: this.state.loaded ? 'none' : 'block' }}>
                    <div style={{ padding: '1em' }}>
                        <CircularProgress />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
