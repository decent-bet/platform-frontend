import * as React from 'react'
import { IRecaptchaProps, DefaultRecaptchaProps } from './RecaptchaProps'
import { IRecaptchaState, RecaptchaState } from './RecaptchaState'
import { RECAPTCHA_URL } from '../../../constants'

const getCaptchaLoaded = (): any => {
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

const waitForRecaptcha = new Promise(resolve => {
    let interval = setInterval(() => {
        const grecaptcha = getCaptchaLoaded()
        if (grecaptcha !== null) {
            clearInterval(interval)
            resolve(grecaptcha)
        }
    }, 1000)
})

export default class Recaptcha extends React.PureComponent<
    IRecaptchaProps,
    IRecaptchaState
> {
    public static defaultProps = new DefaultRecaptchaProps()
    private _containerRef: any

    constructor(props: IRecaptchaProps) {
        super(props)
        this.state = new RecaptchaState()
    }

    public componentDidMount() {
        if (getCaptchaLoaded() === null) {
            injectScript()
        }
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
            grecaptcha.ready(() => {
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
                ref={el => (this._containerRef = el)}
            />
        )
    }
}
