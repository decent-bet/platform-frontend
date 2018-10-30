export default interface IFrameProps {
    onLoad: () => any
    title: string
    frameBorder?: number | string
    id: string
    src: string
    allowFullScreen: boolean
    style?: any
    height?: number | string
    width?: number | string
}
