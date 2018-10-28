export default interface IAppBarToolbarProps {
    address: string
    tokenBalance: number
    vthoBalance: number
    onCopyAddress: () => void
    accountHasAddress: boolean
    isCasinoLogedIn: boolean
}
