import * as React from 'react'
import { IRecaptchaProps, DefaultRecaptchaProps } from './RecaptchaProps'
import { IRecaptchaState, RecaptchaState } from './RecaptchaState'
import { RECAPTCHA_SITE_KEY } from '../../../config'

const injectScript = (): void => {
    const filtered = Array.from(document.scripts).filter(
        script => script.src.indexOf(RECAPTCHA_SITE_KEY) > -1
    )
    if (filtered.length <= 0) {
        const script = document.createElement('script')

        script.async = true
        script.defer = true
        script.src = RECAPTCHA_SITE_KEY

        if (document.head) {
            document.head.appendChild(script)
        }
    }
}

const waitForRecaptcha = new Promise(resolve => {
    let interval = setInterval(() => {
        if (
            typeof window !== 'undefined' &&
            typeof (window as any).grecaptcha !== 'undefined' &&
            typeof (window as any).grecaptcha.render !== 'undefined'
        ) {
            clearInterval(interval)
            resolve((window as any).grecaptcha)
        }
    }, 1000)
})

export default class Recaptcha extends React.Component<
    IRecaptchaProps,
    IRecaptchaState
> {
    public static defaultProps = new DefaultRecaptchaProps()
    private _containerRef: any

    constructor(props: IRecaptchaProps) {
        super(props)
        this.state = new RecaptchaState()
        this._containerRef = null
    }

    public componentDidMount() {
        injectScript()
        this._renderGrecaptcha()
    }

    private _renderGrecaptcha() {
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

        waitForRecaptcha.then((grecaptcha: any) => {
            const widget = grecaptcha.render(this._containerRef, {
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
        return <div ref={el => (this._containerRef = el)} />
    }
}
