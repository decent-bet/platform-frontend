export interface IStateChannelBuilderState {
    dialogIsOpen: boolean
    value: string
}

export const StateChannelBuilderDefaultState = {
    dialogIsOpen: false,
    value: '100'
} as IStateChannelBuilderState
