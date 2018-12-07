import { ReactElement } from 'react'

export interface IAppDrawerItemProps {
    viewToSelect: string
    isSelected: boolean
    icon: ReactElement<any>
    title: string
    onViewChangeListener: (route: string) => void
}
