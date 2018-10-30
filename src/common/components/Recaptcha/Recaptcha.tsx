import * as React from 'react'
import { IRecaptchaProps, DefaultRecaptchaProps } from './RecaptchaProps'
import { IRecaptchaState, RecaptchaState } from './RecaptchaState'
import { RECAPTCHA_URL } from '../../../constants'

const injectScript = (): void => {
    const filtered = Array.from(document.scripts).filter(
        script => script.src.indexOf(RECAPTCHA_URL) > -1
    )
    if (filtered.length <= 0) {
        const script = document.createElement('script')

        script.async = true
        script.defer = true
        script.src = RECAPTCHA_URL

        if (document.head) {
            document.head.appendChild(script)
        }
    }
}

export default class Recaptcha extends React.PureComponent<
    IRecaptchaProps,
    IRecaptchaState
> {
    public static defaultProps = new DefaultRecaptchaProps()
    private _containerRef: React.RefObject<HTMLDivElement>
    constructor(props: IRecaptchaProps) {
        super(props)
        this.state = new RecaptchaState()
        this._containerRef = React.createRef<HTMLDivElement>()
        this.reset = this.reset.bind(this)
        this.renderGrecaptcha = this.renderGrecaptcha.bind(this)
        this.waitForRecaptcha = this.waitForRecaptcha.bind(this)
    }

    private get captchaLoaded() {
        const _window: any = window
        if (
            typeof _window !== 'undefined' &&
            typeof _window.grecaptcha !== 'undefined' &&
            typeof _window.grecaptcha.render !== 'undefined'
        ) {
            return _window.grecaptcha
        }

        return null
    }

    public async componentDidMount() {
        if (this.captchaLoaded === null) {
            injectScript()
        }

        await this.renderGrecaptcha()
    }

    public componentWillUnmount() {
        this.reset()
    }

    private waitForRecaptcha() {
        return new Promise(resolve => {
            let interval = setInterval(() => {
                const grecaptcha = this.captchaLoaded
                if (grecaptcha !== null) {
                    clearInterval(interval)
                    resolve(grecaptcha)
                }
            }, 1000)
        })
    }

    private async renderGrecaptcha() {
        const {
            sitekey,
            theme,
            type,
            size,
            tabindex,
            hl,
            badge,
            verifyCallback,
            expiredCallback,
            onloadCallback
        } = this.props

        const grecaptcha: any = await this.waitForRecaptcha()

        grecaptcha.ready(async () => {
            const widget = await grecaptcha.render(this._containerRef.current, {
                sitekey,
                theme,
                type,
                size,
                tabindex,
                hl,
                badge,
                onloadCallback,
                callback: verifyCallback,
                'expired-callback': expiredCallback
            })

            this.setState({ grecaptcha, widget })
            if (onloadCallback) {
                onloadCallback()
            }
        })
    }

    public reset() {
        const { grecaptcha, widget } = this.state
        if (widget !== null) {
            grecaptcha.reset(widget)
        }
    }

    public render() {
        return (
            <div
                style={{
                    maxWidth: '260px !important',
                    height: 78
                }}
                ref={this._containerRef}
            />
        )
    }
}
