export enum StateMachine {
    Loading = 1,
    Ready = 2
}

/**
 * House Component State
 */
export interface IHouseState {
    stateMachine: StateMachine
}

/**
 * Default Values for `IHouseState`
 */
export const DefaultHouseState: IHouseState = {
    stateMachine: StateMachine.Loading
}
