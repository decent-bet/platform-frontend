/**
 * Created by user on 7/4/2017.
 */
import React from 'react'
import IFrameProps from './IFrameProps'

export default class IFrame extends React.Component<IFrameProps> {
    private _iframeRef: React.RefObject<HTMLIFrameElement>

    constructor(props: IFrameProps) {
        super(props)
        this._iframeRef = React.createRef<HTMLIFrameElement>()
    }

    public componentDidMount() {
        const node = this._iframeRef.current
        if (node) {
            node.addEventListener('load', this.props.onLoad)
        }
    }

    public componentWillUnmount() {
        const node = this._iframeRef.current
        if (node) {
            node.removeEventListener('load', this.props.onLoad)
        }
    }

    public render() {
        return (
            <iframe
                ref={this._iframeRef}
                title={this.props.title}
                frameBorder={this.props.frameBorder || '0'}
                id={this.props.id}
                src={this.props.src}
                allowFullScreen={this.props.allowFullScreen || false}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    border: 0
                }}
            />
        )
    }
}
