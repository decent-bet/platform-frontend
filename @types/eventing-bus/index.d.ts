declare module 'eventing-bus' {
    import * as EventingBus from 'eventing-bus'

    export type EventingBus = {
        on: EventingBusListener
    }

    export type EventingBusListener = {
        (label: string, event: any): any
    }
}
