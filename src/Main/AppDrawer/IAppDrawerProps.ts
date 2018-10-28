import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export default interface IDrawerProps {
    width: Breakpoint
    address: string
    accountHasAddress: boolean
    isCasinoLogedIn: boolean
    onCopyAddress: () => void
    tokenBalance: number
    vthoBalance: number
    isDrawerOpen: boolean
    onDrawerCloseListener: () => void
    onViewChangeListener: (selectedView: string) => void
    selectedView: string
    onFaucetClickedListener: () => void
}
