export enum StateMachine {
    Loading = 1,
    Ready = 2
}

export interface IHouseState {
    stateMachine: StateMachine
}

export const DefaultHouseState: IHouseState = {
    stateMachine: StateMachine.Loading
}
